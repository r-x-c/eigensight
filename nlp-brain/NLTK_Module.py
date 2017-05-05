from __future__ import division
import operator
import string
import nltk
from nltk.tokenize import sent_tokenize
import RAKE
import util

def getKeywords(input):
	rake_object = RAKE.Rake("queen.txt")
	keywords = rake_object.run(input)
	util.debug(keywords)

def nltk_analysis(input):
	sent_tokenize_list = sent_tokenize(input)
	for sentence in sent_tokenize_list:
		util.debug(sentence)
		text = nltk.word_tokenize(sentence)
		pttext = nltk.pos_tag(text)
		keywords = []
		getKeywords(sentence)
		for pair in pttext:
		    util.debug(pair)
		    # print(nltk.help.upenn_tagset(pair[1]))

