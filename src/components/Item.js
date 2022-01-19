import React, { useState, useEffect } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TwitterIcon from '@mui/icons-material/Twitter';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';

import '../stylesheets/Item.scss';
/* given nasa url to fetch from
   render interactive mui component that displays:
    - title on top
    - img/vid beneath
    - copyright (if any in italic)
    - collapsed description text (default collapsed)
    - share button
    - like button
    TODO: animated like/tweet button
    TODO: different sizes based on prop 
 */
const Item = ({ url }) => {
    // saves a copy of json sent by NASA
    const [mediaObj, setMediaObj] = useState(null);

    // becomes false when media_type is image and is loaded OR
    // when media_type is video
    const [loading, setLoading] = useState(true);

    // hides text explanation to reduce clutter when true
    const [collapsed, setCollapsed] = useState(true);

    // user like 
    const [liked, setLiked] = useState(false);

    const handleMediaLoaded = () => {
        setLoading(false);
    }

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    }

    const handleLike = () => {
        setLiked(!liked);
    }

    useEffect(() => {
        if (url === "") {
            return;
        }
        fetch(url)
            .then(data => data.json())
            .then(media => {
                console.log(media);
                /*
                    media={
                        date:str
                        explanation:str
                        media_type:str image|video
                        title:str
                        url:str
                        hdurl[opt]:str
                        copyright[opt]:str
                        thumbs[opt-exists when media_type=video]:str
                    }
                */
                setMediaObj(media);

            })
            .catch(e => {
                console.log(e);
                handleMediaLoaded();
            });
    }, []);

    const renderMedia = () => {
        if (mediaObj === null) {
            return (
                <Typography sx={{ display: loading ? "none" : "block" }}>
                    Oops! Something went wrong!
                </Typography>);
        }
        const url = mediaObj.hasOwnProperty("hdurl") ? mediaObj["hdurl"] : mediaObj["url"];
        const tweetUrl = `https://twitter.com/intent/tweet?hashtags=nasa,space&text=${encodeURIComponent("Wow! Look at this picture posted by NASA's Astronomy Picture of the Day! " + url)}`;
        let med = null;
        if (mediaObj["media_type"] === "video") {
            handleMediaLoaded();
            med = <video
                src={url}
                className="media"
                controls
                poster={mediaObj["thumbnail_url"]}
            >
                Video not supported by browser!
            </video>

        }
        else if (mediaObj["media_type"] === "image") {
            med = <img
                src={url}
                alt={"image of " + mediaObj["title"]}
                onLoad={handleMediaLoaded}
                className="media"
            />
        }
        else {
            med = <Typography>Unrecognized media type!</Typography>
        }
        return (
            <div style={{ display: loading ? "none" : "block" }}>
                <CardActionArea onClick={handleCollapse}>
                    <CardHeader
                        title={mediaObj["title"]}
                        subheader={mediaObj["date"]}
                    />
                    {med}
                    {mediaObj.hasOwnProperty("copyright") ? <Typography variant="caption" sx={{ fontStyle: "italic" }}>{mediaObj["copyright"]}</Typography> : null}
                    <Collapse
                        in={!collapsed}
                        timeout="auto"
                        unmountOnExit
                    >
                        <CardContent>
                            <Typography>
                                {mediaObj["explanation"]}
                            </Typography>
                        </CardContent>

                    </Collapse>
                </CardActionArea>

                <CardActions sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2
                }}>
                    <Button variant="outlined" onClick={handleLike}>

                        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        {liked ? "Unlike" : "Like"}
                    </Button>
                    <Button variant="contained" href={tweetUrl} target="_blank" >
                        <TwitterIcon />
                        Tweet
                    </Button>
                </CardActions>

            </div>
        )
    }
    return (
        <Card sx={{
            maxWidth: 800,
            minWidth: 340,
            minHeight: 400
        }}>
            <div style={{
                display: loading ? "flex" : "none",
                marginTop: "10rem",
                justifyContent: "center"
            }} >
                <CircularProgress />
            </div>
            {renderMedia()}
        </Card>
    )
}

export default Item;