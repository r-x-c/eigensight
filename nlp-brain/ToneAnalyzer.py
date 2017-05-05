# CTEC 121 Intro to Programming and Problem Solving
# Bruce Elgort / Clark College
# Using IBM Watson's Tone Analyzer to detect and interpret emotional, social, and writing cues found in text.
# February 26, 2016
# Version 1.0
 
import requests
import json
from pprint import pprint
import util

def analyze_tone(text):
    username = '8ac6c0f7-4e06-409f-9565-513e6200cf2b'
    password = 'NZpgFyfYPAMe'
    watsonUrl = "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&sentences=false"
    headers = {"content-type": "text/plain"}
    data = text
    try:
        r = requests.post(watsonUrl, auth = (username, password),
                          headers = headers, data= data)
        return r.text
    except:
        return False
  
def display_results(data):
    data = json.loads(str(data))
    for i in data['document_tone']['tone_categories']:
        util.debug(i['category_name'])
        util.debug("-" * len(i['category_name']))
        for j in i['tones']:
            util.debug(j['tone_name'].ljust(20),(str(round(j['score'] * 100,1)) + "%").rjust(10))
        print()
    print()

def parse_results(data):
    data = json.loads(str(data))
    x = {}
    for i in data['document_tone']['tone_categories']:
        for j in i['tones']:
            x[j['tone_name']] = j['score']
    return x
