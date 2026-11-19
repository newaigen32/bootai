"""
Chat logic – decides what the bot replies.

For now these are simple fixed replies.
Later, this is the file where we will call the AI model.
"""

GREETINGS = {"hi", "hii", "hello", "hey", "good morning", "good afternoon", "good evening"}
GOODBYES = {"bye", "goodbye"}


def make_reply(message: str) -> str:
    text = message.lower().strip(" !.?")

    if text in GREETINGS:
        return "Hello! I'm Boot AI. How can I help you today?"
    if text in GOODBYES:
        return "Goodbye! Have a great day."
    if "your name" in text:
        return "My name is Boot AI."

    return f'You said: "{message}". I\'m not connected to an AI model yet, but the backend is working!'
