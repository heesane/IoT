import sys

if len(sys.argv) <= 1:
    print("Usage : "+sys.argv[0]+" myID")
    exit()

print("myID(1st arg) : " +  sys.argv[1])

for line in sys.stdin:
    print(line.strip(), sys.argv[1])