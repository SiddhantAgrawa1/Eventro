#!/usr/bin/env python
# coding: utf-8
from pymongo import MongoClient
DB = 'mongodb+srv://curioussid:curioussid@eventtracking.cfkcoeg.mongodb.net/eventTracking?retryWrites=true&w=majority'

client = MongoClient(DB)
db = client.eventTracking

# In[70]:


# import required libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from math import sqrt
import scipy.sparse as sp
from scipy.sparse.linalg import svds
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import json

import os

filename = 'event_data.csv'

if os.path.exists(filename):
    os.remove(filename)

filename = 'user_data.csv'

if os.path.exists(filename):
    os.remove(filename)

events_db = db.events.find()
events_db = list(events_db)
events_df = pd.DataFrame(events_db)


user_db = db.user_events.find()
user_db = list(user_db)
user_df = pd.DataFrame(user_db)

events_df.to_csv('event_data.csv', index=False)
user_df.to_csv('user_data.csv', index=False)

events_df = pd.read_csv('event_data.csv')
user_df = pd.read_csv('user_data.csv')

def get_event(event_id) :
    # print(events_df)          
    # print("Pyhton data ",events_df.iloc[event_id].to_json(orient ='index'))
    return json.loads(events_df.iloc[event_id].to_json(orient ='index'))  


# In[71]:


# print(events_df['event_date'])


# In[72]:


# preprocess the data
events_df['event_description'].fillna('', inplace=True)


# In[73]:


# create a user-event matrix for the original dataset
user_event_matrix = user_df.pivot(index='user_id', columns='event_id', values='event_rating').fillna(0)
user_event_matrix = sp.csr_matrix(user_event_matrix.values)


# In[74]:


user_event_matrix = user_event_matrix.astype(float)


# In[75]:


u, s, vt = svds(user_event_matrix, k=20)

s_diag_matrix = np.diag(s)
predicted_ratings = np.dot(np.dot(u, s_diag_matrix), vt)


# In[76]:


# create a document-term matrix for event descriptions
vectorizer = CountVectorizer(stop_words='english')
event_descriptions = vectorizer.fit_transform(events_df['event_description'])
cosine_similarities = cosine_similarity(event_descriptions)


# In[77]:


# define a function to get top n similar events based on content
def get_similar_events_content(event_id, n):
    event_index = events_df[events_df['event_id'] == event_id].index[0]
    similar_indices = cosine_similarities[event_index].argsort()[:-n-1:-1]
    similar_events = events_df.iloc[similar_indices]['event_id'].tolist()
    return similar_events

# define a function to get top n recommended events for a user
# def get_recommended_events(user_id, n):
#     user_ratings = predicted_ratings[user_id - 1]
#     event_indices = np.argsort(user_ratings)[::-1]
#     recommended_events = []
#     for event_index in event_indices:
#         if len(recommended_events) == n:
#             break
#         event_id = events_df.iloc[event_index]['event_id']
#         similar_events = get_similar_events_content(event_id, n)
#         for similar_event in similar_events:
#             if similar_event not in recommended_events:
#                 recommended_events.append(similar_event)
#             if len(recommended_events) == n:
#                 break
#     rec = []
#     for event in recommended_events :
#         rec.append(get_event(event))
#     return rec



def get_recommended_events(user_id, n, page_num, page_size):
    user_ratings = predicted_ratings[user_id - 1]
    event_indices = np.argsort(user_ratings)[::-1]
    recommended_events = []
    for event_index in event_indices:
        if len(recommended_events) == n * page_num + page_size:
            break
        event_id = events_df.iloc[event_index]['event_id']
        similar_events = get_similar_events_content(event_id, n)
        for similar_event in similar_events:
            if similar_event not in recommended_events:
                recommended_events.append(similar_event)
            if len(recommended_events) == n * page_num + page_size:
                break
    start_idx = (page_num - 1) * page_size
    end_idx = page_num * page_size
    recommended_events_page = recommended_events[start_idx:end_idx]
    rec = []
    for event in recommended_events_page:
        rec.append(get_event(event))
    return rec




# In[81]:


# test the original recommendation system
user_id = 3
n_recommendations = 5
# recommended_events = get_recommended_events(user_id, n_recommendations)
# print('Recommended events for user', user_id, 'using original model:', recommended_events)


# In[ ]:




