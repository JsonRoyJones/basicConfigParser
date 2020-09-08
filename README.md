# basicConfigParser

A basic config parser used to read basic key=value configuration files

# Getting Started

1. [ ] Install your npm dependencies by running `npm install` in your terminal.
1. [ ] Run `npm run dev` to start your server and bundle the frontend. It will launch the frontend application in a browser window which will have an input box for specific keys you wish to request from the config file.

# Prompt

1. [ ] Do not use existing "complete" configuration parsing libraries/functions, we want to see how you would write the code to do this.
1. [ ] Use of core and stdlib functions/objects such as string manipulation, regular expressions, etc is ok.
1. [ ] We should be able to get the values of the config parameters in code, via their name. How this is done specifically is up to you.
1. [ ] Boolean-like config values (on/off, yes/no, true/false) should return real booleans: true/false.
1. [ ] Numeric config values should return real numerics: integers, doubles, etc
1. [ ] Ignore or error out on invalid config lines, your choice.
1. [ ] Please include a short example usage of your code so we can see how you call it/etc.
1. [ ] Push your work to a public git repository (github, bitbucket, etc) and send us the link.

# Example of Valid Config File

Valid config file: <br />
/# This is what a comment looks like, ignore it <br />
/ #All these config lines are valid <br />
host = test.com <br />
server_id=55331 <br />
server_load_alarm=2.5 <br />
user= user <br />
/ #comment can appear here as well <br />
verbose =true <br />
test_mode = on <br />
debug_mode = off <br />
log_file_path = /tmp/logfile.log <br />
send_notifications = yes <br />
