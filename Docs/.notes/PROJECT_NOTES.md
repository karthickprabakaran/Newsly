App : 

nextjs

DATABASE:


postgressql

App Overview: 

 ->  An news app that will get news from the 7 news sources from india.


Features of the App:

-> Signup (google,mailid, apple)
-> Login (google,mailid, apple)
-> Sessions for 10mins
-> View Recent News
-> filter By Category
-> search news 
-> Pagination in the Frontend
-> Lazy Loading (Loading Frist 30 News First)

end points : 

/getallnews get 
/getsuggestednews get
/dashboard get
/updateprofile patch
/login post
/signup    post

const NEWS_SOURCES = [
    {
        name: 'Times of India',
        url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
        category: 'General',
    },
    {
        name: 'NDTV News',
        url: 'https://feeds.feedburner.com/ndtvnews-latest',
        category: 'General',
    },
    {
        name: 'The Hindu',
        url: 'https://www.thehindu.com/news/feeder/default.rss',
        category: 'General',
    },
    {
        name: 'Indian Express',
        url: 'https://indianexpress.com/feed/',
        category: 'General',
    },
    {
        name: 'Economic Times',
        url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
        category: 'General',
    },
    {
        name: 'BBC Tamil',
        url: 'https://feeds.bbci.co.uk/tamil/rss.xml',
        category: 'General',
    },
    
];







Still Need to do : 

-- complete the edit profile (fix the population on signup)
-- Implement the Sessions (try the Inbuild using the Supabase)
-- Complete the Signup using the Google and the Apple
-- Make the UI changes 
-- Launch the App after the Testing
-- note the special things in the app 