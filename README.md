# MovieZ

## **Introduction**

TODO
## **Prerequisites**
Moviez is designed with this architecture, I cannot guarantee the stability on older or newer major versions.

* **Node.js** version: 14.15.3
* **npm** version 6.14.9
* You have a folder of movie files
* All of your movies are in the same root folder. They can have different subfolders though, as MovieZ will search recursively. For instance if you have a folder structure like this:

```
C:/
│
└───movieRootFolder
    │   Titanic.mkv
    │   Interstellar.avi    
    │
    └───Star Wars
    |   |
    │   └───Original trilogy
    │   |   │   Star Wars Episode 4
    │   |   │   Star Wars Episode 5
    │   |   │   Star Wars Episode 6
    |   |   |
    │   └───Prequel trilogy
    │       │   Star Wars Episode 1
    │       │   Star Wars Episode 2
    │       │   Star Wars Episode 3
    │   
...(etc)
```
then this would great with MovieZ. Simply define your "directory" in settings as **C:/movieRootFolder**

*   Also, the names of the video files themselves are important. MovieZ will always try to "normalize" the names of movie files to make them readable, and strip away attributes and information from the movie.

    But the file still needs to have the movie name in it. If you have for instance the movie The Lord of the Rings: Fellowship of the ring, but the file is named **lotr-fotr.avi** then there is no way for MovieZ to know what movie this is, and cannot search for it on IMDB. Try to always have the movie title, and maybe also the year of the movies release, in the video file name. For instance **Hunger Games 2012.avi**. The year is great because it helps with the searchin algorithm and reduces the risk of mixing up the movie with another one, like a sequel or a remake that has a similar name.

## **Get started**

1. Clone the repo

    ```
    git clone https://github.com/ToWelie89/MovieZ.git
    ```
2. Navigate to folder

    ```
    cd MovieZ
    ```
3. Install npm dependencies

    ```
    npm install
    ```
4. Configure your settings in settings.js. Set the variable "directory" to your desired folder where you keep your movies. The rest of the settings you can leave as default.

5. Start MovieZ

    ```
    npm start
    ```
    *The first time you do this it will take a while to load, depending on how many movies you have in your folder. Approximately it will take around 1 second per movie, so for instance 200 movies = 200 seconds = 3 minutes and 20 seconds.* **Be patient**.

    You can speed up this load time by setting **scanDataFromIMDB** to false in **settings.js**, but if you do that you will not see any of neat data that is scraped from IMDB, like movie poster, user rating, plot, actors, genres etc. A lot functionalites of MovieZ depend on this data.

6. After MovieZ has finished scanning your movies it will launch a server that you can reach locally in your browser on http://127.0.0.1:5000

## **Troubleshooting**

### **The movies listed are not updating after I made changes to files/folders in the root movie directory**
Remove the cache.json file from the backend/cache folder.

### **One of my movies is not present in the MovieZ library!**

This could be because the movie was not a valid file format. MovieZ will look for video files that are avi, mkv, mp4 and also disc image files (iso / img).

### **Some of my listed movies are displaying incorrect information**

If a movie in your directory is displaying a poster of a different movie, that means it was unsuccessful in searching up the correct movie in IMDB. You can start troubleshooting in the following steps:
    
1. Your movie file name is written in way that is hard to determine the actual name of the movie. **Make sure the actual name of the movie is a part of the file name.** The name can contain other information as well (1080p, 5.1 DT, SWESUB, HDRIP etc), MovieZ will always try to filter away such information in order to find the correct name of the movie.

2. There are other movies with similar names, this could happen for instance when there are remakes or sequels. If you have the original Poltergeist movie from 1982 for instance, then it would be a good idea to name the movie something along the lines of **Poltergeist 1982.avi**, this will make it easier for MovieZ to find the correct one from IMDB.

3. Check IMDB:s website if the movie even exist there. Even though IMDB covers MOST movies there are cases where movies do not exist there. Especially older and obscure movies.

**Note that when you make changes to your movies folder, like changing names of movie files, you will to load in your data again. Delete the cache.json files from your backend/cache folder and restart MovieZ**

If you have considered the previous steps and you still have a problem with a movie showing the wrong information, there is a way to hardcode which IMDB page the movie should be associated with.

Create a file called **custom.json** and place it in the **same folder as the movie you are having issues**. The created JSON file should have the following information:
```
{
    "imdbData": {
        "imdbId": "<IMDB ID TO THE MOVIE IN QUESTION>"
    }
}
```
Fill in the IMDB-ID of the movie. Go to IMDB, search up your movie and then get the ID from the URL. It should have a format like **tt1392170**.

![imdb_id](https://raw.githubusercontent.com/ToWelie89/MovieZ/master/docs/imdb_id.png)

It is important that the **custom.json** file is in the same folder as the movie, and that there are no other movies in that folder. Therefore a folder structure like this is recommended:

```
movieRootFolder
    └───Alien
    |   └───Alien 1979.avi
    |   └───custom.json
    └───Aliens
    |   └───Aliens 1986.avi
    |   └───custom.json
etc
```
This way MovieZ will easily know which custom.json file belongs to which movie. The id used in that file will override MovieZ search function where it automatically tries to look up the correct movie.
