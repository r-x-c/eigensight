# mother ai

import threading
import ToneAnalyzer as ta
import NLTK_Module as nltk_module

def startTimer():
  threading.Timer(60.0 * 5, startTimer).start() # called every minute
  print("Ping!! 5 minutes have passed get the fuck back to work")

startTimer()
"""
It hurt me so much that you rejected me for being sad. It still hurts me to think about it, and makes me sad that you made it all about you instead...that I was ruining your happy day, that my sadness was so ugly to you, that I deserved to be cast aside and blamed and judged when I needed your love and warmth...you turned cold. You didn't support me mum, when I really needed you, you weren't there. I know you didn't understand how to help me, and I knew you couldn't either, I don't blame you for that...but the way you treated me when I was in that state...you were so hard and devoid of compassion.

It hurt me so much that you rejected me for being sad. It still hurts me to think about it, and makes me sad that you made it all about you instead. you were so hard and devoid of compassion.

"""


def respondSadness(input):
	print("I'm sorry feel better")

def respondFear(input):
	print("You're going to be ok, child")

def respondDisgust(input):
	print("That's ridiculous, tell me more")

def respondAnger(input):
	print("Tell me more about why you're angry")

def respondJoy(input):
	print("You're happy! Tell me more about what makes you happy")

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
	#results = ta.analyze_tone(input)
	#ta.display_results(results)
	#ibm_dict = ta.parse_results(results)
	#triggerEmpathy(ibm_dict, input)
	nltk_module.nltk_analysis(input)
	return "tuus est pulchra"

def main():
	print("Under Construction")
	print("-" * len("Under Construction"))
	while (1): 
		var = input("You: ")
		out = genResponse(var)
		print ("Mom_ai: ", out)



if __name__ == "__main__":
	main()


