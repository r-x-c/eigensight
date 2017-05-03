

def genResponse(input):
	return input + " foo"

if __name__ == "__main__":
	while (1): 
		var = input(">> ")
		out = genResponse(var)
		print ("Response: ", out)