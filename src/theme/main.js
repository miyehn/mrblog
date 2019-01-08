import React, { Component } from 'react';
import {Redirect} from 'react-router';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import jQuery from 'jquery';
import request from 'request';
import ReactMarkDown from 'react-markdown';
import Amplitude from 'amplitudejs';
import moment from 'moment';
import './style/style.css';
import { Intro, Friends, PostsPerPage, 
  password, email, socialHandles, title} from '../config.js';

import {FaTumblrSquare as Tumblr} from 'react-icons/fa';
import {FaWeibo as Weibo} from 'react-icons/fa';
import {TiSocialInstagram as Ins} from 'react-icons/ti';
import {FaTwitterSquare as Twitter} from 'react-icons/fa';
import {IoMdMail as Mail} from 'react-icons/io';
import {GoMarkGithub as Github} from "react-icons/go";

import {IoIosSkipBackward as Prev} from 'react-icons/io';
import {IoIosSkipForward as Next} from 'react-icons/io';
import {TiMediaPlay as Play} from 'react-icons/ti';
import {TiMediaPause as Pause} from 'react-icons/ti';

var Lofter = require('./assets/lofter.png');
var domainName = process.env.REACT_APP_DOMAIN;

var auth = false;
var summary = [];
var summaryPublic = [];
var playlist = [];
var future = moment(1e15);
document.title = title;

var tagsUpdater = ()=>{}
var tagsRefresher = ()=>{}
var postManagerRefresher = ()=>{}

jQuery.ajax({
  type: 'GET',
  dataType: 'json',
  url: domainName + '/mrblog-content/blogSummary',
  success: (data)=>{
    summary = data.map(obj=>{
      obj.date = (obj.date.trim().toLowerCase()==='pinned') ? future : moment(obj.date); 
      return obj;
    });
    summary = summary.sort((p1,p2)=>{
      var t1 = p1.date.unix();
      var t2 = p2.date.unix();
      if(isNaN(t1)) t1 = -1;
      if(isNaN(t2)) t2 = -1;
      return t2-t1;
    });
    summaryPublic = summary.filter(post=>{return post.publicity <= 1});
    tagsRefresher();
    postManagerRefresher();
  },
  async: false
});

jQuery.ajax({
  type: 'GET',
  dataType: 'json',
  url: domainName + '/mrblog-content/tracklist',
  success: (data)=>{
    playlist = data.map(obj=>{
      obj.url = domainName + '/mrblog-content/tracks/' + obj.filename;
      return obj;
    });
  },
  async: false
});

export default class Main extends Component {
  render() {return(
    <HashRouter hashType="noslash" onUpdate={() => window.scrollTo(0, 0)}>
      <div>
        <div className="content-all container-fluid">
          <SideColumn />
          <MainColumn />
        </div>
        <Footer />
      </div>
    </HashRouter>
  )}
}

function MainColumn () {return (
    <div className="mainColumn col-xs-12 col-md-8"><Switch>
      {/* Home page */}
      <Route exact path="/" component={()=><PostsManager tag={undefined} page={0} />} />
      {/* page num */}
      <Route exact path="/page/:num" render={({match})=>
        <PostsManager tag={undefined} page={match.params.num} />} />
      {/* tag (with page num) */}
      <Route exact path="/tag/:tag/page/:num" render={({match})=>
        <PostsManager tag={match.params.tag} page={match.params.num} />} />
      {/* tag */}
      <Route exact path="/tag/:tag" render={({match})=>
        <PostsManager tag={match.params.tag} page={0} />} />
      }
    </Switch></div>
)}

function SideColumn () {return (
    <div className="sideColumn col-xs-12 col-md-4">
      <Avatar />
      <Social />
      <Intro />
      <TagsSummary />
      <Friends />
      <AmplitudePlayer />
    </div>
)}

function fetchPost(fullpath) {
  var content = 'loading...';
  jQuery.ajax({
    type: 'GET',
    url: domainName + '/mrblog-content/blogposts' + fullpath,
    success: (data)=>{content = data},
    async: false
  });
  return content;
}

class PostsManager extends Component {
  constructor(props){
    super(props);
    this.state = {
      filterTag: this.props.tag,
      renderPosts: [],
      perPage: PostsPerPage,
      currentPage: this.props.page,
      totalPage: 0
    };
    this.posts = [];
  }

  componentDidMount() {
    this.updateRenderPage(this.state.filterTag, this.state.currentPage);
    postManagerRefresher = this.forceUpdate;
  }

  updateRenderPage(tag, page) {
    this.state.filterTag = tag;
    var postByTag = [];
    var grandList = auth ? summary : summaryPublic;
    grandList.map(obj=>{
      if(tag===undefined || obj.tags.includes(tag)) postByTag.push(obj);
    })
    this.state.totalPage = Math.ceil(postByTag.length/this.state.perPage);
    this.state.currentPage = parseInt(page);
    this.state.renderPosts = [];
    for(var i=0; i<this.state.perPage; i++){
      var post = postByTag[i + this.state.currentPage*this.state.perPage];
      if(post!==undefined){
        var content = (auth&&post.publicity===1) ? fetchPost(post.path+"-alt") : fetchPost(post.path);
        post.content = content;
        this.state.renderPosts.push(post);
      }
    }
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProp){
    this.updateRenderPage(nextProp.tag, nextProp.page);
  }

  render() {
    window.scrollTo(0, 0);
    var here = this.state.currentPage;
    var tag = this.state.filterTag;
    var prev, next;
    if(tag===undefined){
      prev = '/page/'+(here-1);
      next = '/page/'+(here+1);
    }
    else {
      prev = '/tag/'+tag+'/page/'+(here-1);
      next = '/tag/'+tag+'/page/'+(here+1);
    }
    return (
      <div>{
        this.state.renderPosts.map (postObj =>
          <PostRenderer postObj={postObj} key={postObj.path} />
        )}
        {here>0 && here<this.state.totalPage && 
          <Link className="prev light" to={prev}>Prev</Link>}
        {here<this.state.totalPage-1 && here>=0 && 
          <Link className="next light" to={next}>Next</Link>}
      </div>
    );
  }
}

function Date({date}) {return(
  <div className="date">
    {date.unix()===future.unix() ? "Pinned" : date.format('MMM D YYYY　dddd h:mmA')}
  </div>
)}

function PostRenderer ({postObj}){ return(
  <div>
    <Date date={postObj.date} />
    <div className="post">
      <div>
        { postObj.title!=='' && <div className="title">{postObj.title}</div> }
        <ReactMarkDown className="markdown" escapeHtml={false} source={postObj.content} />
      </div>
      { postObj.tags.map(item=><Tag key={postObj.path+item} text={item} search={item} />) }
    </div>
  </div>
)}

//can't reference this outside so had to wrap setState() this way
var whyIHaveToDoThis = (x)=>{} 
class TagsSummary extends Component {
  constructor(props){
    super(props);
    this.state = {tagList: []};
  }

  componentDidMount(){
    tagsRefresher = this.forceUpdate();
    tagsUpdater = this.updateMe;
    whyIHaveToDoThis = (x)=>this.setState({tagList: x});
    this.updateMe();
  }

  updateMe(){
    var tagNameList = [];
    var tagList = [];
    var grandList = auth ? summary : summaryPublic;
    grandList.map(obj=>{
      obj.tags.map(tag=>{
        var ind = tagNameList.indexOf(tag);
        if(ind<0) { tagList.push({tagName: tag, count:1}); tagNameList.push(tag);}
        else {tagList[ind].count += 1;}
      })
    })
    tagList.sort((a,b)=>{return b.count-a.count});
    whyIHaveToDoThis(tagList);
  }

  render(){
    return (
    <div className="tagsAll">
      {this.state.tagList.map(tag=>
        <Tag key={tag.tagName} 
             text={tag.tagName+' '+tag.count}
             search={tag.tagName} />)}
    </div>
  )}
}

function Tag ({text, search}) {return (
    <Link className="tag" to={'/tag/'+search}>{text}</Link>
)}

function Social() { 
  var mailto = "mailto" + email;
  var handles = socialHandles.filter(s=>{
    return s.url.trim().length > 0
  });

  var toIcon = function(s) {
    if (s==="instagram") {
      return <Ins id="instagram" className="social light" size={26} />
    } else if (s==="lofter") {
      return <img src={Lofter} id="lofter" className="social light"/>
    } else if (s==="weibo") {
      return <Weibo className="social light" size={22} />
    } else if (s==="tumblr") {
      return <Tumblr className="social light" size={22} />
    } else if (s==="github") {
      return <Github className="social light" size={22} />
    } else if (s==="twitter") {
      return <Twitter className="social light" size={22} />
    }
  }

  return(
  <div className="socialAll">
    {handles.map(item=>
      <a key={item.platform} href={item.url}> {toIcon(item.platform)} </a>
    )}

    <br/>

    <a className="light" href={mailto}>
      <Mail id="mail" size={18} /> {email}
    </a>
  </div>
)}

class AmplitudePlayer extends Component {

  progressClickHandler( e ){
    var offset = e.target.getBoundingClientRect();
    var x = e.pageX - offset.left;
    try{
      Amplitude.setSongPlayedPercentage( ( 
        parseFloat( x ) / parseFloat( e.target.offsetWidth) ) * 100 );
    } catch (e) {}
  }

  render() { 
    if (playlist.length == 0) return null;
    else return (
    <div className="musicplayer hidden-xs hidden-sm">
      <span amplitude-song-info="info" amplitude-main-song-info="true"></span><br/>
      <progress 
        onClick={this.progressClickHandler}
        id="song-played-progress" 
        className="amplitude-song-played-progress" 
        amplitude-main-song-played-progress="true">
      </progress>
      <span id="music-prev" className="amplitude-prev">
        <Prev size={14}/>
      </span>
      <span className="amplitude-play-pause"><PlayPause /></span>
      <span id="music-next" className="amplitude-next">
        <Next size={14}/>
      </span>
    </div>
  )}
}

class PlayPause extends Component {
  constructor(props){
    super(props);
    this.state = {playing: false};
    this.playPauseHandler = this.playPauseHandler.bind(this);
    this.setToPlay = this.setToPlay.bind(this);
  }
  componentDidMount(){
    Amplitude.init({
      bindings: {
        37: 'prev',
        39: 'next',
      },
      songs: playlist,
      volume: 75,
      callbacks: {
        song_change: this.setToPlay
      }
    });
  }
  playPauseHandler() {
    this.state.playing = !(this.state.playing);
    this.forceUpdate();
  }
  setToPlay(){
    this.state.playing = true;
    this.forceUpdate();
  }
  render(){
    var play = <Play size={18} onClick={this.playPauseHandler}/>;
    var pause = <Pause size={18} onClick={this.playPauseHandler}/>
    var content = this.state.playing ? pause : play
    return content;
  }
}

class Avatar extends Component {
  constructor(props) {
    super(props);
    this.pic = '';
    this.showpic = true;
    try {
      this.pic = require('../avatar.png');
    } catch (e) {
      try {
        this.pic = require('../avatar.jpg');
      } catch (e) {
        this.showpic = false;
      }
    }
    this.avatar = this.showpic ? 
    <img className="avatar" src={this.pic}/> : <div className="avatar">{title}</div>
  }

  render() { return(
    <div>
      <Link to="/">{this.avatar}</Link>
    </div>
  )}
}

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 'React', redirect: false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    if(this.state.value.toLowerCase()===password){
      auth = true;
      this.setState({redirect: true});
      tagsUpdater();
    }
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render(){ 
    var content;
    if(this.state.redirect) {
      this.state.redirect = false;
      content = <Redirect to="/" />
    } else {content =
      <form onSubmit={this.handleSubmit}>
        <span>Powered by </span>
        <input className="footerInput" size="5" type="text" 
            value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value="" />
      </form>
    }
    return (
      <div className="footer">{content}</div>
  )}
}