import os
import logging
import json
import numpy as np
import schedule
import time
from typing import List, Tuple

import openai
from pytrends.request import TrendReq
import requests
from bs4 import BeautifulSoup
from googlesearch import search
from web3 import Web3

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s: %(message)s',
                    handlers=[
                        logging.FileHandler('trend_question_generator.log'),
                        logging.StreamHandler()
                    ])
logger = logging.getLogger(__name__)

# Set up OpenAI API
openai.api_key = os.getenv('OPENAI_API_KEY')

# Constants
RPC_URL = os.getenv('RPC_URL')
CONTRACT_ADDRESS = "0xC30667547075F372E1582706964296EBC235E182"
CONTRACT_ABI = [{
    "type":
    "function",
    "name":
    "createOpinionPool",
    "inputs": [{
        "name": "_name",
        "type": "string",
        "internalType": "string"
    }, {
        "name": "_optionNames",
        "type": "string[]",
        "internalType": "string[]"
    }],
    "outputs": [{
        "name": "",
        "type": "address",
        "internalType": "address"
    }],
    "stateMutability":
    "nonpayable",
}]

PRIVATE_KEY = os.getenv("AGENT_KEY")
web3 = Web3(Web3.HTTPProvider(RPC_URL))
signer = web3.eth.account.from_key(PRIVATE_KEY)
print(f"Using wallet address: {signer.address}")

# Connect to network
web3 = Web3(Web3.HTTPProvider(RPC_URL))
# Load the contract
contractImpl = web3.eth.contract(abi=CONTRACT_ABI, address=CONTRACT_ADDRESS)

# Global variables
unique_questions: List[Tuple[str, np.ndarray]] = []


def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))


def get_trending_topics() -> List[str]:
    """Fetch trending topics using Google Trends."""
    logger.info("Fetching trending topics...")
    try:
        pytrends = TrendReq(hl="en-US", tz=330)  # Set language and timezone
        trending_searches_df = pytrends.trending_searches(
            pn="india")  # Adjust region if needed
        trending_topics = trending_searches_df[0].tolist()
        logger.info(f"Found {len(trending_topics)} trending topics")
        first_three_topics = trending_topics[:3]
        logger.info(f"Top 3 trending topics: {first_three_topics}")
        return first_three_topics
    except Exception as e:
        logger.error(f"Error fetching trends: {e}")
        return []


# def get_combined_trending_topics(topics: List[str],
#                                  region: str = "india",
#                                  total_topics: int = 3) -> Optional[List[str]]:
#     """
#     Fetch and combine trending topics across multiple domains.

#     Args:
#     topics (List[str]): List of topics to check trending searches
#     region (str, optional): Country/region for trending searches. Defaults to "india".
#     total_topics (int, optional): Total number of trending topics to return. Defaults to 3.

#     Returns:
#     Optional[List[str]]: List of combined trending topics
#     """
#     logger.info(f"Fetching combined trending topics for: {topics}")

#     try:
#         # Initialize pytrends with language and timezone
#         pytrends = TrendReq(hl="en-US", tz=330)

#         # Results dictionary to store trending topics for each domain
#         trending_results = {}

#         for topic in topics:
#             # Perform interest by region query for the specific topic
#             pytrends.build_payload([topic], geo=region)

#             # Get related queries
#             related_queries = pytrends.related_queries()
#             # Initialize lists for queries
#             rising_queries = []
#             top_queries = []

#             if related_queries and topic in related_queries:
#                 # Extract rising and top queries
#                 rising_queries = related_queries[topic]['rising'][
#                     'query'].tolist()
#                 top_queries = related_queries[topic]['top']['query'].tolist()

#             # Combine and remove duplicates
#             all_queries = list(dict.fromkeys(top_queries + rising_queries))

#             # Log the trending topics for this domain
#             logger.info(f"Trending topics for {topic}: {all_queries[:2]}")

#             # Store up to 2 topics for each domain
#             trending_results[topic] = all_queries[:2]

#         # Flatten and combine topics from all domains
#         combined_topics = list(
#             itertools.chain.from_iterable(
#                 trending_results.get(topic, [])[:2] for topic in topics))

#         # Ensure we return exactly the requested number of topics
#         final_topics = combined_topics[:total_topics]

#         logger.info(f"Final combined trending topics: {final_topics}")
#         return final_topics

#     except Exception as e:
#         logger.error(f"Error fetching trends: {e}")
#         return None


###
def fetch_google_context(query: str) -> str:
    """Fetch Google search results and extract context."""
    logger.info(f"Fetching context for query: {query}")
    try:
        search_results = list(search(query,
                                     num_results=3))  # Fetch top 3 results
        context = ""
        for url in search_results:
            try:
                response = requests.get(url, timeout=5)
                soup = BeautifulSoup(response.text, 'html.parser')
                text = " ".join(
                    p.text
                    for p in soup.find_all('p')[:3])  # First 3 paragraphs
                context += f"Source: {url}\n{text}\n\n"
            except Exception as e:
                logger.warning(f"Error fetching content from {url}: {e}")
                continue
        return context.strip()
    except Exception as e:
        logger.error(f"Error during Google search for '{query}': {e}")
        return ""


def generate_questions_with_context(
        topics: List[str]) -> List[Tuple[str, str]]:
    """Generate unique yes/no prediction questions with context."""
    questions = []

    for topic in topics:
        try:
            logger.info(f"Processing topic: {topic}")

            context = fetch_google_context(topic)
            if not context:
                logger.warning(f"No context found for topic: {topic}")
                continue

            attempts = 0
            while attempts < 3:
                try:
                    prompt = (
                        f"Based on the following context about '{topic}', generate a straightforward yes/no "
                        f"question that involves a prediction or forecast:\n\n{context}"
                    )

                    response = openai.chat.completions.create(
                        model="gpt-4",
                        messages=[{
                            "role":
                            "system",
                            "content":
                            "You are an assistant that generates yes/no questions."
                        }, {
                            "role": "user",
                            "content": prompt
                        }],
                        max_tokens=50,
                        temperature=0.7)

                    question = response.choices[0].message.content.strip()

                    embedding_response = openai.embeddings.create(
                        input=question, model="text-embedding-ada-002")
                    question_embedding = np.array(
                        embedding_response.data[0].embedding)

                    # Check uniqueness
                    is_unique = True
                    for _, prev_embedding in unique_questions:
                        similarity = cosine_similarity(question_embedding,
                                                       prev_embedding)
                        if similarity > 0.95:
                            is_unique = False
                            break

                    if is_unique:
                        unique_questions.append((question, question_embedding))
                        questions.append((topic, question))
                        logger.info(
                            f"Generated unique question for topic: {topic}")
                        break

                    attempts += 1
                except Exception as e:
                    logger.error(
                        f"Error generating question for '{topic}': {e}")
                    break

        except Exception as e:
            logger.error(f"Unexpected error processing topic '{topic}': {e}")

    return questions


def save_questions(questions: List[Tuple[str, str]]):
    """Save generated questions to a file."""
    try:
        # Ensure questions directory exists
        os.makedirs('questions', exist_ok=True)

        # Generate filename with timestamp
        filename = f'questions/questions_{time.strftime("%Y%m%d_%H%M%S")}.json'

        with open(filename, 'w') as f:
            json.dump([{
                "topic": topic,
                "question": question
            } for topic, question in questions],
                      f,
                      indent=4)
        logger.info(f"Questions saved to {filename}")
    except Exception as e:
        logger.error(f"Error saving questions: {e}")


def main_task():
    """Main task to generate and save questions."""
    logger.info("Starting trend question generation task")

    try:
        # Get trending topics
        trending_topics = get_trending_topics()

        # topics_to_check = ["crypto", "web3", "blockchain"]
        # trending_topics = get_combined_trending_topics(topics_to_check)

        # Generate questions
        questions = generate_questions_with_context(trending_topics)

        create_opinion_pool_base(questions)
        # create_opinion_pool_polygon(questions)


        # Save questions
        if questions:
            save_questions(questions)
        else:
            logger.warning("No questions generated")

    except Exception as e:
        logger.error(f"Unexpected error in main task: {e}")


def create_opinion_pool_base(questions: List[Tuple[str, str]]):
    try:
        for question in questions:

            logger.info(f"Processing question: {question[1]}")
            # Extract the first and second elements of the tuple
            _name = question[1]
            _optionNames = ["Yes", "No"]

            # Get the nonce
            nonce = web3.eth.get_transaction_count(signer.address)
            # Estimate gas
            gas_estimate = contractImpl.functions.createOpinionPool(
                _name, _optionNames).estimate_gas({'from': signer.address})

            # Get current gas price
            gas_price = web3.eth.gas_price

            # Prepare transaction
            txn = contractImpl.functions.createOpinionPool(
                _name, _optionNames).build_transaction({
                    'chainId': web3.eth.chain_id,
                    'gas': gas_estimate,
                    'gasPrice': gas_price,
                    'nonce': nonce,
                })

            # Sign transaction
            signed_txn = web3.eth.account.sign_transaction(txn, PRIVATE_KEY)

            # Send transaction
            txn_hash = web3.eth.send_raw_transaction(
                signed_txn.raw_transaction)

            # Wait for transaction receipt
            txn_receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
            print(
                f"Transaction successful! Transaction hash: {txn_hash.hex()}")

    except Exception as e:
        print(f"Error: {e}")
    
# def create_opinion_pool_polygon(questions: List[Tuple[str, str]]):
#     url = "https://sandbox-api.okto.tech/api/v1/rawtransaction/execute"
#     headers = {
#         "Authorization": f"Bearer {os.getenv('YOUR_SECRET_TOKEN')}",  # Replace with your actual secret token
#         "Content-Type": "application/json"
#     }

#     for question in questions:
#         try:
#             logger.info(f"Processing question: {question[1]}")
            

#             # Prepare transaction payload
#             transaction_data = contractImpl.encodeABI(
#                 fn_name="createOpinionPool",
#                 args=[question[1], ["Yes", "No"]]
#             )

#             payload = {
#                 "network_name": "POLYGON_TESTNET_AMOY",  # Adjust as needed
#                 "transaction": {
#                     "from": "0xEB0cE02D9d424cfE98B6ee9693120D040A0d5802",  # MPC wallet address
#                     "to": "0x9EaD9b18cC8ad171a36afa565054791b5E147FBB",  # Target contract address
#                     "data": transaction_data,  # Encoded ABI data
#                     "value": "0x0"  # If no ETH/MATIC is being sent
#                 }
#             }

#             # Execute transaction via API
#             response = requests.post(url, json=payload, headers=headers)
#             response_data = response.json()

#             if response.status_code == 200:
#                 logger.info(f"Transaction successful: {response_data}")
#             else:
#                 logger.error(
#                     f"Transaction failed: {response.status_code}, {response_data}"
#                 )

#         except Exception as e:
#             logger.error(f"Error creating opinion pool for question '{question[1]}': {e}")



def main():
    """Main function to schedule and run the service."""
    logger.info("Trend Question Generator Service Started")

    # Schedule the task to run every 2 hours
    schedule.every(2).hours.do(main_task)

    # Run the first task immediately
    main_task()

    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("Service stopped by user")
    except Exception as e:
        logger.error(f"Unhandled error: {e}")
