
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def botMsg(*arg):
	# todo: replace var with custom class name
	name = "Mom"
	print("%s : " % (name), end='')
	for el in arg:
		print(bcolors.OKGREEN + "%s" % (el, )  + bcolors.ENDC, end=' ')
	print()


# input : debug("hello", 159)
# output: hello 159
def debug(*arg):
	for el in arg:
		print (bcolors.WARNING + "%s" % (el, ) + bcolors.ENDC,  end=' ')
	print()