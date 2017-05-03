from __future__ import division
import operator
import string
import nltk
from nltk.tokenize import sent_tokenize

def nltk_analysis(input):
	sent_tokenize_list = sent_tokenize(input)
	for sentence in sent_tokenize_list:
		print(sentence, "\n\n")
		text = nltk.word_tokenize(sentence)
		print(nltk.pos_tag(text))


