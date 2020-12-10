import sys

import speech_recognition as sr


r = sr.Recognizer()
hellow = sr.AudioFile(sys.argv[1])
with hellow as source:
    audio = r.record(source)
    s = r.recognize_google(audio,language=sys.argv[2])
    # TODO: Need to add a google api key
    print(s.encode('utf-8'))
    sys.stdout.flush()