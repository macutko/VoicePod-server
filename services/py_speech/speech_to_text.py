import sys

import speech_recognition as sr

r = sr.Recognizer()
hellow = sr.AudioFile(sys.argv[1])
with hellow as source:
    audio = r.record(source)
    s = r.recognize_google(audio)
    print(s)
    sys.stdout.flush()
