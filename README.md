# Spacestagram

microservice that fetches from NASA's apod API and displays the resulting astronomy picture/video

## Jan 18 2022 v0.1.0
 - <Item /> component that will render one apod json by accepting one valid url
 - TODO: left/right swapper (animate?)
 - TODO: render list of <Item /> based on date range (render only those in viewport? break into multiple pages?)

## Jan 19 2022 v0.2.0
- render item list
- date picker
- TODO: warning message when too many picked / cap message when way over max
- TODO: fade in loader
- TODO: render only when in viewport

## Jan 19 2022 v0.3.0
- fade in/out loading animation
- render only when in viewport
- TODO: warning message

## Jan 19 2022 v0.4.1
- warning message
- fix out of viewport resulting in never loading item
- fix fast scroll results in render unmount error
- TODO: style/theme

## Jan 19 2022 v0.4.2
- style
- add title
- fix missing key in jsx list
- TODO: theme
- TODO: background