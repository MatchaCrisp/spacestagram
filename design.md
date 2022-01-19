## brainstorm

nasa caps api calls to 1000/hour -> need to ensure graceful handling when limit reached and nothing is fetched

start with single component page with:
 - left mouse/scrollup/left keyboard for prev
 - right mouse/scrolldown/right keyboard for next

nasa start img from 1995-06-16, need to gracefully handle dates smaller and dates larger than curr date

~~TODO:~~ figure out when nasa api adds new imgs (timezone)
 - seems to be UTC-4 (US eastern)
 - should really be stated in api doc

concepts are disabled so no twitter hashtags

load description only when user wants it
pictures/videos should be set to fixed width

nasa returns hdurl for hd, url for non-hd
 - possible to load hdurl only when good network speed?
 - hdurl is not always present, handle gracefully

 thinking of techs:
 - sass
 - mui
 - react

like button 
share button

above is MVP

how to deal with copyright imgs??

TODO: 
 - load a bunch at a time
 - load based on date picker
 - load between date range
 - animated like button
 - loading state/transition to loaded
 - transitions for description
 - make the MVP version into embed for any website maybe?
 - pick consistent theme