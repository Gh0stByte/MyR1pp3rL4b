# MyR1pp3rL4b

This script will rip your questions and answers from [**MyProgrammingLab by Pearson**](http://myprogramminglab.com/). Export them as a CSV or for importing into a [**Quizlet**](http://quizlet.com/) set. Easily injectible into your brower, and is incorperated into the native UI.


## Features

* Rip to CSV
* Rip for Quizlet
* Native UI Integration


# r - A very creative namespace

### Variables

| Var    | Description |
| ------ | ----------- |
| ```CurrentRipElem```| A variable to store the chapter/section to use in the save file|
| ```Q_SEPERATE_TERM```| Delimiters for term. Default ```^^^```  |
| ```Q_SEPERATE_DEFF```| Delimiters for card. Default ```~~~```  |
| ```prevSubmissions```| Dictionary of submissions. Key ```exSSN```, Value```Array of previous submissions```|
| ```instructions``` | Dictionary of instructions. Key ```exSSN```, Value ```Instruction string```| 

### Methods

| Method | Args | Return | Description |
| ------ | ---- | ------ | ------------| 
|```setSubmissions```|```s``` - dict of submissions|void|Set ```prevSubmissions``` to ```s```|
|```getSubmissions```|none|```prevSubmissions```|Get ```prevSubmissions```|
|```addSubmission```|```k``` - exSSN, ```s``` - submission|void|Set Key ```k``` and Value ```s``` of ```prevSubmissions```|
|```setInstruction```|```i```-dictionary|void|Set ```instructions``` to ```i```|
|```getInstructions```|none|```instructions```|Get ```instructions```|
|```addInstruction```|```k```-exSSN, ```i```-instruction|void|Set Key ```k``` and Value ```i``` of ```instruction```|
|```getexSSNs```|none|array of ```exSSN```s|Query user for chap/sec number and return all ```exSSN```s from that node as dict|
|```getSubmissionsFromExSSNs```|```exs```-array of exSSNs|none|Sets ```prevSubmissions``` to the submission from each exSSN|
|```getInstructionsFromExSSNs```|```exs```-array of exSSNs|none|Sets ```instructions``` to the instructions from each exSSN|
|```parseAnswer```|```ans```-answer string|cleaned up string|Cleans up ```ans``` by removing html tags|
|```parseForCSV```|```q```-question string|string for CSV|Removes escape characters and replaces ```"``` with ```""```|
|```ripToCSV```|none|void|Rips questions and downloads as CSV|
|```ripForQuizlet```|none|void|Rips questions and shows them in textarea to copy into Quizlet|
|```rip```|```mode```-CSV(1) or Quizlet(0)|void|Gets user input and calls appropriate ripping function|
|```copyText```|none|void|Copies text generated for Quizlet to clipboard|
|```toggleTextArea```|none|void|Toggle the ripper div|
|```setupUI```|none|void|Sets up the textarea, buttons, and dropdown|

# Usage

## Injection (FireFox)

* Download/Copy content of  [MyR1pp3rL4b.js](../master/MyR1pp3rL4b.js)
* Open Inspect Element
* Go to Console
* Paste into console and press *enter*

##  Ripping

### To CSV
* Select **Rip to CSV**
 ![](https://image.prntscr.com/image/R9IjsKI8TPWmRFSZUr2XXw.png) 

* Enter **Chapter** or **Section** number
* Download **CSV**
![](https://image.prntscr.com/image/uEha3-knRZORQV6nFoQugQ.png)


### Into Quizlet

* Select **Rip for Quizlet** from dropdown
![](https://image.prntscr.com/image/8fZxhAk2QZeErNH-tTMCUw.png)
* Enter **Chapter** or **Section** number
![](https://i.imgur.com/BdTTLuB.png)
* Press **Copy**
* Create new **Quizlet** set
* Select Import
![](https://i.imgur.com/0wAAK6Q.png)
* Paste into the textbox
* Set the custom delimiters to **^^^** & **~~~**
![](https://i.imgur.com/ww4sztq.png)
* Preview cards
![](https://i.imgur.com/R0LQ4Eh.png)
* Click **Import**


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## History

## 1.0 (2/10/2018)
* Initial Release 


## Credits

Made by [Gh0stByte](http://twitter.com/Gh0stByte)

## License

This project is licensed under GNU General Public License v3.0. See [License](/blob/master/LICENSE)
