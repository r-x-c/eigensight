# mother ai

import threading
import ToneAnalyzer as ta
import NLTK_Module as nltk_module
import sys
import pandas as pd
import util

# def startTimer():
#   threading.Timer(60.0 * 5, startTimer).start() # called every minute
#   print("Ping!! 5 minutes have passed get the fuck back to work")

# startTimer()

"""
It hurt me so much that you rejected me for being sad. It still hurts me to think about it, and makes me sad that you made it all about you instead...that I was ruining your happy day, that my sadness was so ugly to you, that I deserved to be cast aside and blamed and judged when I needed your love and warmth...you turned cold. You didn't support me mum, when I really needed you, you weren't there. I know you didn't understand how to help me, and I knew you couldn't either, I don't blame you for that...but the way you treated me when I was in that state...you were so hard and devoid of compassion.

It hurt me so much that you rejected me for being sad. It still hurts me to think about it, and makes me sad that you made it all about you instead. you were so hard and devoid of compassion.

"""

chatlog_df = pd.DataFrame()

def respondSadness(input):
	util.botMsg("I'm sorry feel better")

def respondFear(input):
	util.botMsg("You're going to be ok, child")

def respondDisgust(input):
	util.botMsg("That's ridiculous, tell me more")

def respondAnger(input):
	util.botMsg("Tell me more about why you're angry")

def respondJoy(input):
	util.botMsg("You're happy! Tell me more about what makes you happy")

def triggerEmpathy(data_dict, input):
	if data_dict['Sadness'] > .3:
		respondSadness(input)
	if data_dict['Fear'] > .3:
		respondFear(input)
	if data_dict['Disgust'] > .3:
		respondDisgust(input)
	if data_dict['Anger'] > .3:
		respondAnger(input)
	if data_dict['Joy'] > .3:
		respondJoy(input)


def genResponse(input):
	results = ta.analyze_tone(input)
	ta.display_results(results)
	ibm_dict = ta.parse_results(results)
	triggerEmpathy(ibm_dict, input)
	nltk_module.nltk_analysis(input)
	return "lorem ipsum"
def intro():
	print("Welcome to Mother AI, a vision and brainchild to build a better tomorrow, by providing direction to children and others who lack parental guidance or presence")
	print("Under Construction, 'bye' to exit")

def main():
	intro()
	# loading msgs from disk:
	try:
		chatlog_df = pd.DataFrame.from_csv("log.csv")
	except:
		print("Failed to read chatlog from disk:", sys.exc_info()[0])



	# todo, load gender 0 : fem, 1 : male
	gender = 1
	util.botMsg("Hi, you can call me mom. What's on your mind", ("son?" if gender else "daughter?"))
	while (1): 
		var = input("You: ")
		# write conversation to disk
		if var.lower() == "bye":
			util.botMsg("It was nice chatting, talk soon.")
			sys.exit()

		out = genResponse(var)
		util.botMsg(out)


if __name__ == "__main__":
	main()


