# CTEC 121 Intro to Programming and Problem Solving
# Bruce Elgort / Clark College
# Using IBM Watson's Tone Analyzer to detect and interpret emotional, social, and writing cues found in text.
# February 26, 2016
# Version 1.0
 
import requests
import json
from pprint import pprint

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
        print(i['category_name'])
        print("-" * len(i['category_name']))
        for j in i['tones']:
            print(j['tone_name'].ljust(20),(str(round(j['score'] * 100,1)) + "%").rjust(10))
        print()
    print()

def parse_results(data):
    data = json.loads(str(data))
    x = {}
    for i in data['document_tone']['tone_categories']:
        for j in i['tones']:
            x[j['tone_name']] = j['score']
    return x


def main():     
    data = raw_input("Enter some text to be analyzed for tone analysis by IBM Watson (Q to quit):\n")
    print(len(data))
    if len(data) >= 1:
        results = analyze_tone(data)
        if results != False:
            display_results(results)
            exit
    else:
        print("Something went wrong")
 
if __name__ == "__main__":
    main()