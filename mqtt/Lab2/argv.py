import sys

print('command line : ', sys.argv)
print('\t# of arguments : ', len(sys.argv))
if len(sys.argv) > 1:
    print("the first argument is " +  sys.argv[1])