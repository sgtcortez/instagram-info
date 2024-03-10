# Summary

- [Introduction](#Introduction)
- [How to Use](#How-to-Use)

# Introduction

This project is just for educational purposes, something to create a tool to check who someone started to follow, the users that unfollowed the user, when and etc ...

Logged in instragram, just output this javascript code:  
[from](https://stackoverflow.com/a/74133719/12873636)

It will requests the followers and the following from the user ... 
Then, it will create a downloable file ...

**Obs:** It may not work with celebrities ... 
Because, its to much and instagram can actually block normal people to see their followers ...

# How to Use

To make thigs work, you will need to log in on instagram in the webbrowser, then, open the developer mode and paste the source code(`get_infos.js`).  
Then, just call the main function: `start_fetch` providing the instagram username of the user ...   
For example:  
```js
start_fetch('<username>');
```

It will generate a file containg the information of the user, and its followers and following ...

To compare followers use:   
```bash
jq .followers[].id <file1> | sort > /tmp/followers1.txt
jq .followers[].id <file2> | sort > /tmp/followers2.txt
diff /tmp/followers1.txt /tmp/followers2.txt
```

It will return which users id were removed, and which were added.    
Note: Use instagram user id(because a user may change usernames).  
After getting the id, find in the files.

