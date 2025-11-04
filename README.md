# Consumer Sales Fake Review Detection and Deletion

## Overview

The **Consumer Sales Fake Review Detection and Deletion** is an AI-powered platform designed to detect fake, AI-generated, or promotional reviews in bulk datasets. It enables organizations to assess the credibility of reviews through a series of NLP and AI-driven evaluations. Each review is processed through multiple analytical layers such as sentiment classification, AI content probability, spam detection, link and keyword extraction, and overall authenticity scoring.

The system organizes reviews in batches, processes them asynchronously, and provides visual insights, filtering capabilities, and export options through a user-friendly dashboard.

---

## Objectives

1. Detect suspicious or artificially generated reviews.
2. Classify review sentiment and assess rating-text consistency.
3. Identify spam, links, and promotional content.
4. Compute an authenticity score to categorize reviews as genuine or suspicious.
5. Provide analytics through visual dashboards and batch-level summaries.

---

## Architecture

* **Frontend:** React.js with Vite and TailwindCSS
* **Backend:** Node.js with Express.js
* **Database:** MongoDB
* **AI Models:** Hugging Face transformers (for NLP tasks) and fine-tuned AI content detection models

---
## Core Functionalities

1. **Sentiment and Consistency Analysis:**
   Compares the expressed sentiment with the numerical rating to identify inconsistent or misleading reviews.

2. **Named Entity Recognition (NER):**
   Detects organizations, products, and promotional mentions to flag marketing-based content.

3. **Spam and Link Detection:**
   Uses regex and NLP filters to identify links or repetitive promotional keywords.
   
5. **AI Content Detection:**
   Identifies potential AI-generated reviews using fine-tuned language models that assess perplexity, coherence, and writing entropy.
   
6. **Authenticity Scoring:**
   Combines multiple features (AI probability, sentiment coherence, keyword density) into a composite authenticity score.

---

## Frontend Features

* Interactive dashboard displaying batch-level statistics.
* Review-level analytics including sentiment, AI score, and authenticity score.
* Filtering and search functionality within the “Detailed Review Analysis” table.
* Select, select-all, download, and delete actions for reviews.
* Graphical visualization of sentiment distribution, authenticity ratio, and detection metrics.

---

## Future Enhancements

* Integration with real-time review APIs (Amazon, Flipkart, Yelp).
* Improved AI-detection accuracy with multilingual model support.
* Automated retraining pipelines for adaptive model learning.
* Role-based user access and batch sharing functionality.

---

## License

This project is for academic and research purposes. Unauthorized redistribution of any proprietary model or dataset is prohibited.
