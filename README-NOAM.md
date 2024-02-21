## Work Process
* Get to know the repository hierarchy
* Inspect element in the browser
* Review the code at a high level
* Starting the tickets

-----------------

## Tickets
| Name                                        | Type    |
|---------------------------------------------|---------|
| Video Trimmer Responsiveness                | Bug     |
| Seek Bar Accuracy                           | Bug     |
| Custom Play/Pause Buttons and Progress Bar  | Feature |
| Time Indicators for Trimmer                 | Feature |
| Time Indicator for Trimmed Section          | Feature |

-----------------
## Priorities
### Video Trimmer Responsiveness
This functionality lies at the core of the system, and its proper functioning is essential as it can impact the user experience and the development of 2 other features that I intend to implement.

-----------------

## Explain bug fixes
### Video Trimmer Responsiveness
Move the 'mousemove' event listener outside the original useEffect to prevent repeated registration and
unregistration of multiple event listeners plus fix the diff calculation in 
