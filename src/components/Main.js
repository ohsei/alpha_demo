import React, { Component } from 'react'
import Menu from './Menu/Menu'
import Segments from './Segment/Segments'

import styled from 'styled-components'
import PrintArticle from './Print/PrintArticle'

const defaultWidth = 1200
const strDefaultWidth = defaultWidth.toString() + 'px'

/* define layout start*/

const DivBg = styled.div`
  display: ${props => props.isPrint ? 'none' : 'block'};
  background-color: lightgreen;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
`
const DivFixed = styled.div`
  position:fixed;
  width:100%;
  height:200px;
  z-index:9;
  top:0;
  left:0;
  background-color: lightgreen;
`
const DivTitle = styled.div`
  position: fixed;
  
  z-index: 99;
  top: 0px;
  left: 0px;

  display: flex;
  display: -ms-flex;
  flex-direction: row;
  -ms-flex-direction: row;
  text-align: center;
  justify-content: flex-start;
  height: 40px;

  width: ${strDefaultWidth};
`
const DivMenu = styled.div`
  position: fixed;
  z-Index: 999;
  top: 50px;
  left: 5px;
`
const DivSetLang = styled.div`
  display: flex;
  z-Index: 99;
  margin: 0 0 0 50px;
  position: fixed;
  top: 50px;
  flex-direction: row;
  -ms-flex-direction: row;
`
const DivInput = styled.div`
  z-Index: 99;
  position: fixed;
  top: 80px;
  display: flex;
  flex-direction: row;
  -ms-flex-direction: row;
  justifyContent: flex-start;
  margin: 0 0 0 50px;
  width: ${strDefaultWidth};
  height: 100px;
  border: 2px solid orange;
  background-color: white;
`
const DivSegments = styled.div`
  z-Index: 0;
  display: block;
  margin: 200px 0 0 50px;
  width: ${props=>props.width};

  @media print{
    margin: 0;
    padding: 0;
  }
`
const InSetLang = styled.input`
  height: 25px;
  width: 20px;
`
const LabSetLang = styled.label`
  color: white;
  size: 25px;
`
const inputAreaHeight = '100px'

const InSetColor = styled.input`
  height: ${inputAreaHeight};
`
const TextArea = styled.textarea`
  margin: 0 0 0 1px;
  width: 85%;
  height: ${inputAreaHeight};
  font-size: 24px;
  border: none;
`
const Button = styled.button`
  width: 50px;
  height: ${inputAreaHeight};
  border: ${props => {if (props.active == true) {return '2px solid black'} else {return '1px solid lightgray'}}};
  font-size: 3.5em;
  color: #aaa;
  text-align: center;
  text-decoration: ${props => {if (props.active == true) {return 'underline'} else {return 'none'}}};
  background-color: white;
`
const DivFixedTitle = styled.div`
  background-color: lightgreen;
  width: 20%;
  font-size: 30px;
  color: white;
`
const TitleBorder = styled.div`
  margin: 4px 0 0 0;
  width: 60%;
  border: 2px solid orange;
  background-color: white;
`
const InFileTitle = styled.input`
  margin: 0;
  width: 100%;
  height: auto;
  font-size:24px;
  border: none;
`
/* define layout end*/


const enWordSize = 27
const bigWordEnSize = 40
const spaceWordEnSize = 48
const otherWordEnSize = 20

const enWordSizeBigger = enWordSize * 1.5
const bigWordEnSizeBigger = bigWordEnSize * 1.5
const spaceWordEnSizeBigger = spaceWordEnSize * 1.5
const otherWordEnSizeBigger = otherWordEnSize * 1.5

const landscapeWidth = defaultWidth * 1.5
const portraitWidth = defaultWidth
const defaultSetting = {
  layout:'portrait',
  jaPos:'up',
  enSize:'60pt',
  upJaSize:'24pt',
  downJaSize:'オフ',
  lineColor:'lightgray',
  lineNum:4,
  interval:'24pt',
  lineNos: 0,
}

const PrintOrientation = (object) => {
  if (object.layout == 'landscape'){
    return(
      <style type="text/css">
        {'@media print{@page {size: A4 landscape; margin: 0}}'}
      </style>
    )
  }
  else{
    return(
      <style type="text/css">
        {'@media print{@page {size: A4 portrait; margin: 0}}'}
      </style>
    )
  }
}

class Main extends Component {
  constructor (props){
    super(props)
    this.state = {
      article:{
        segments: [{id:0, type: 'txtOnly', dataUrl: '', jaSentence:'', isPageBreak: false, allString: '', sentences:[{id:0, words:[]}]}],
        setting:{},
        saveFileTitle:'',
      },
      curSegmentNo:0,
      width: defaultWidth,
      enWordSize: enWordSize,
      bigWordEnSize: bigWordEnSize,
      otherWordEnSize: otherWordEnSize,
      spaceWordEnSize: spaceWordEnSize,
      setting: defaultSetting,
      nowLanguage:'english',
      name:'',
      calWordWidth: 0,
      printSegments: '',
      isPrint: false,
      imeMode: 'inactive',
      isBoldBtnActive: false,
      isItalicBtnActive: false,
      isUnderLineBtnActive: false,
      isCtrlKeyPressed: false,
      isEnterKeyPressed: false,
    }
    /* セグメントの追加、削除 */
    this.editSegments = this.editSegments.bind(this)
    /* 編集中セグメントの選択 */
    this.setCurSegment = this.setCurSegment.bind(this)
    /* セグメントの追加、called by editSegments */
    this.addSegment = this.addSegment.bind(this)
    /* セグメントの削除、called by editSegments */
    this.delSegment = this.delSegment.bind(this)
    /* 文章タイトルの設定 */
    this.setFileTitle = this.setFileTitle.bind(this)
    /* 文章ロード処理 */
    this.loadFile = this.loadFile.bind(this)
    /* 設定メニュー処理 */
    this.setSetting = this.setSetting.bind(this)
    /* 英文入力モード選択 */
    this.setEnglish = this.setEnglish.bind(this)
    /* 和文入力モード選択 */
    this.setJapanese = this.setJapanese.bind(this)
    /* 入力欄処理 */
    this.onInputKeyup = this.onInputKeyup.bind(this)
    /* 色設定 */
    this.setColor = this.setColor.bind(this)
    /* Bold設定 */
    this.setBold = this.setBold.bind(this)
    /* italic設定 */
    this.setItalic = this.setItalic.bind(this)
    /* underline設定 */
    this.setUnderline = this.setUnderline.bind(this)
    /* 新規ファイル作成 */
    this.createNewFile = this.createNewFile.bind(this)
    /* 画像設定 */
    this.setImg = this.setImg.bind(this)
    /* type設定 */
    this.setType = this.setType.bind(this)
    /* 英字文字サイズ取得 */
    this.getEnWordSize = this.getEnWordSize.bind(this)
    /* 改ページ追加 */
    this.addPageBreak = this.addPageBreak.bind(this)
    /* 印刷 */
    this.print = this.print.bind(this)
    /* 印刷完了処理 */
    this.printFinish = this.printFinish.bind(this)
    /* 入力キー制御 */
    this.keyDown = this.keyDown.bind(this)
    /* 入力エリアキー制御 */
    this.onInputKeyDown = this.onInputKeyDown.bind(this)

    this.onInputChange = this.onInputChange.bind(this)

  }

  createNewFile (){
    let tmpSegments =  [{id:0, type: 'txtOnly', dataUrl: '', jaSentence:'', isPageBreak: false, allString: '', sentences:[{id:0, words:[]}]}]
    let tmpSetting = {}
    let tmpArticle = this.state.article
    tmpArticle.segments = tmpSegments
    tmpArticle.setting = tmpSetting
    tmpArticle.saveFileTitle = ''
    this.inputText.value = ''
    this.saveFileTitle.value = ''
    this.english.checked = true
    this.japanese.checked = false
    this.colorChange.value = '#000'
    this.setState({article: tmpArticle})
    this.setState({curSegmentNo: 0})
    this.setState({nowLanguage: 'english'})
    this.setState({imeMode: 'inactive'})
    this.setState({isBoldBtnActive: false})
    this.setState({isItalicBtnActive: false})
    this.setState({isUnderLineBtnActive: false})
  }

  setEnglish (){
    if (this.japanese.checked){
      this.japanese.checked = false
    }
    this.english.checked = true
    let text = ''
    let curSegNo = this.state.curSegmentNo
    let tmpSentences = this.state.article.segments[curSegNo].sentences
    if (this.state.article.segments[curSegNo] !== undefined){
      for (let i = 0;i < tmpSentences.length;i++){
        for (let j = 0;j < tmpSentences[i].words.length;j++){
          text = text + tmpSentences[i].words[j].content
        }
      }
    }
    this.inputText.value = text
    this.inputText.focus()
    this.setState({nowLanguage:'english'})
    this.setState({imeMode: 'inactive'})
    this.colorChange.disabled = false
    this.boldChange.disabled = false
    this.italicChange.disabled = false
    this.underlineChange.disabled = false
  }

  setJapanese (){
    if (this.english.checked){
      this.english.checked = false
    }
    this.japanese.checked = true
    let curSegNo = this.state.curSegmentNo
    this.inputText.value = this.state.article.segments[curSegNo].jaSentence
    this.inputText.focus()
    this.setState({nowLanguage: 'japanese'})
    this.setState({imeMode: 'active'})
    this.colorChange.disabled = true
    this.boldChange.disabled = true
    this.italicChange.disabled = true
    this.underlineChange.disabled = true
  }

  setSetting (param){
    this.setState({setting:param.setting})
    switch (param.setting.layout){
    case 'portrait':
      this.setState({width:portraitWidth})
      break
    case 'landscape':
      this.setState({width:landscapeWidth})
      break
    }
    switch (param.setting.enSize){
    case '60pt':
      this.setState({enWordSize: enWordSize})
      this.setState({bigWordEnSize: bigWordEnSize})
      this.setState({spaceWordEnSize: spaceWordEnSize})
      this.setState({otherWordEnSize: otherWordEnSize})
      break
    case '80pt':
      this.setState({enWordSize: enWordSizeBigger})
      this.setState({bigWordEnSize: bigWordEnSizeBigger})
      this.setState({spaceWordEnSize: spaceWordEnSizeBigger})
      this.setState({otherWordEnSize: otherWordEnSizeBigger})
      break
    }
  }

  loadFile (event){
    this.setState({setting: event.article.setting})
    this.setState({article: event.article})
    this.setState({curSegmentNo: event.article.segments.length - 1})
    this.saveFileTitle.value = this.state.article.saveFileTitle
    this.inputText.focus()
  }

  setFileTitle (event){
    let tmpArticle = this.state.article
    tmpArticle.saveFileTitle = event.target.value

    this.setState({article: tmpArticle})
  }

  addSegment (segType){
    let tmpArticle = this.state.article
    let tmpSegments = tmpArticle.segments
    let curNo = this.state.curSegmentNo
    for (let i = curNo + 1;i < tmpSegments.length;i++){
      tmpSegments[i].id++
    }
    curNo++
    tmpSegments.splice(curNo, 0, {id:curNo, type: segType, dataUrl: '', jaSentence:'', isPageBreak: false, allString: '', sentences:[{id:0, words:[]}]})
    return tmpArticle
  }

  delSegment (){
    let tmpArticle = this.state.article
    let tmpSegments = tmpArticle.segments
    let curNo = this.state.curSegmentNo
    for (let i = curNo + 1;i < tmpSegments.length;i++){
      tmpSegments[i].id--
    }
    tmpSegments.splice(curNo, 1)
    return tmpArticle
  }

  editSegments (object){
    switch (object.pattern){
    case 'add':{
      let tmpArticle = this.addSegment(object.type)

      let curNo = this.state.curSegmentNo + 1
      this.setState({article: tmpArticle})
      this.setCurSegment({curNo:curNo})
      break
    }
    case 'del':{
      let tmpArticle = this.delSegment()

      let curNo = this.state.curSegmentNo - 1
      this.setState({article:tmpArticle})
      this.setCurSegment({curNo:curNo})
      break
    }
    }
  }
  setCurSegment (curNoObj) {
    let text = ''
    let tmpSegments = this.state.article.segments
    let tmpSentences = this.state.article.segments[curNoObj.curNo].sentences
    if (tmpSegments[curNoObj.curNo] !== undefined){
      if (this.english.checked){
        for (let i = 0;i < tmpSentences.length;i++){
          for (let j = 0;j < tmpSentences[i].words.length;j++){
            text = text + tmpSentences[i].words[j].content
          }
        }
      }else{
        text = tmpSegments[curNoObj.curNo].jaSentence
      }
    }
    this.inputText.value = text
    this.setState({curSegmentNo:curNoObj.curNo})
  }

  setBold (){
    let textVal = this.inputText

    let cursorStart = textVal.selectionStart
    let cursorEnd = textVal.selectionEnd

    let tmpArticle = this.state.article
    let tmpCurSegNo = this.state.curSegmentNo
    let tmpSentences = tmpArticle.segments[tmpCurSegNo].sentences

    let lineNo = 0
    let count = 0
    let num = 0

    for (let i = 0;i < tmpSentences.length;i++){
      for (num = 0;num < tmpSentences[lineNo].words.length;num++){
        //選択された
        if (count >= cursorStart && count < cursorEnd){

          let oldBold = tmpSentences[lineNo].words[num].fontWeight
          if (oldBold == 'bold'){
            tmpSentences[lineNo].words[num].fontWeight = 'normal'
          }
          else{
            tmpSentences[lineNo].words[num].fontWeight = 'bold'
          }
        }
        count++
      }
      num = 0
      lineNo ++
    }
    textVal.focus()
    this.setState({isBoldBtnActive: !this.state.isBoldBtnActive})
    this.setState({article:tmpArticle})

  }
  setItalic (){
    let textVal = this.inputText

    let cursorStart = textVal.selectionStart
    let cursorEnd = textVal.selectionEnd

    let tmpArticle = this.state.article
    let tmpCurSegNo = this.state.curSegmentNo
    let tmpSentences = tmpArticle.segments[tmpCurSegNo].sentences

    let lineNo = 0
    let count = 0
    let num = 0


    for (let i = 0;i < tmpSentences.length;i++){
      for (num = 0;num < tmpSentences[lineNo].words.length;num++){
        //選択された
        if (count >= cursorStart && count < cursorEnd){

          let oldItalic = tmpSentences[lineNo].words[num].fontStyle
          if (oldItalic == 'Italic'){
            tmpSentences[lineNo].words[num].fontStyle = 'normal'
          }
          else{
            tmpSentences[lineNo].words[num].fontStyle = 'Italic'
          }
        }
        count++
      }
      num = 0
      lineNo ++
    }
    textVal.focus()
    this.setState({isItalicBtnActive: !this.state.isItalicBtnActive})
    this.setState({article:tmpArticle})
  }

  setUnderline (){
    let textVal = this.inputText

    let cursorStart = textVal.selectionStart
    let cursorEnd = textVal.selectionEnd

    let tmpArticle = this.state.article
    let tmpCurSegNo = this.state.curSegmentNo
    let tmpSentences = tmpArticle.segments[tmpCurSegNo].sentences

    let lineNo = 0
    let count = 0
    let num = 0


    for (let i = 0;i < tmpSentences.length;i++){
      for (num = 0;num < tmpSentences[lineNo].words.length;num++){
        //選択された
        if (count >= cursorStart && count < cursorEnd){

          let oldTextDecoration = tmpSentences[lineNo].words[num].textDecoration
          if (oldTextDecoration == 'underline'){
            tmpSentences[lineNo].words[num].textDecoration = 'none'
          }
          else{
            tmpSentences[lineNo].words[num].textDecoration = 'underline'
          }
        }
        count++
      }
      num = 0
      lineNo ++
    }
    textVal.focus()
    this.setState({isUnderLineBtnActive: !this.state.isUnderLineBtnActive})
    this.setState({article:tmpArticle})
  }

  setColor (){
    let textVal = this.inputText
    let colorChange = this.colorChange

    let cursorStart = textVal.selectionStart
    let cursorEnd = textVal.selectionEnd

    let tmpArticle = this.state.article
    let tmpCurSegNo = this.state.curSegmentNo
    let tmpSentences = tmpArticle.segments[tmpCurSegNo].sentences

    let lineNo = 0
    let count = 0
    let num = 0

    for (let i = 0;i < tmpSentences.length;i++){
      for (num = 0;num < tmpSentences[lineNo].words.length;num++){
        //選択された
        if (count >= cursorStart && count < cursorEnd){
          tmpSentences[lineNo].words[num].color = colorChange.value
        }
        count++
      }
      num = 0
      lineNo ++
    }
    textVal.focus()

    this.setState({article:tmpArticle})
  }

  getEnWordSize (word){
    if (word == 'W'){
      return this.state.bigWordEnSize * 1.5
    }
    else if (word == 'w'){
      return this.state.enWordSize * 1.25
    }
    else if (word.match(/^[A-Z]+$/)){
      return this.state.bigWordEnSize
    }
    else if (word.match(/^[a-z]+$/)){
      return this.state.enWordSize
    }
    else if (word == ' '){
      return this.state.spaceWordEnSize
    }
    else{
      return this.state.otherWordEnSize
    }
  }


  onInputChange (){
    if (this.english.checked){
      this.inputText.value = this.inputText.value.replace(/[^\x01-\x7E]/, '')
    }
  }
  onInputKeyDown (event){
    if (event.which == 13){
      this.setState({isEnterKeyPressed: true})
    }

    if(event.ctrlKey){
      this.setState({isCtrlKeyPressed: true})
    }
  }

  onInputKeyup (event){
    if (this.state.isCtrlKeyPressed && this.state.isEnterKeyPressed){
      this.editSegments({pattern: 'add', type:'txtOnly'})
      this.setState({isCtrlKeyPressed: false})
      this.setState({isEnterKeyPressed: false})
      return
    }
    /* 入力チェック */

    let count = 0
    let tmpSegment = {id:this.state.curSegmentNo, type: 'txtOnly', dataUrl: '', jaSentence:'', allString: '', isPageBreak: false, sentences:[{id:0, words:[]}]}
    let tmpArticle = this.state.article
    let curSegmentNo = this.state.curSegmentNo
    let sentences = tmpArticle.segments[curSegmentNo].sentences
    let lineNo = 0
    let wordNum = 0

    tmpSegment.type = this.state.article.segments[this.state.curSegmentNo].type
    tmpSegment.dataUrl = this.state.article.segments[this.state.curSegmentNo].dataUrl
    tmpSegment.isPageBreak = this.state.article.segments[this.state.curSegmentNo].isPageBreak
    tmpSegment.jaSentence = tmpArticle.segments[curSegmentNo].jaSentence

    if (this.state.nowLanguage == 'japanese'){
      tmpSegment = this.state.article.segments[this.state.curSegmentNo]
      tmpSegment.jaSentence =  event.target.value

      tmpArticle.segments[curSegmentNo] = tmpSegment
      this.setState({article:tmpArticle})

      return
    }

    let tmpLength = 0
    const inStr = this.inputText.value
    const oldAllString = this.state.article.segments[curSegmentNo].allString
   
    if (oldAllString.length > 0 && inStr.indexOf(oldAllString) == -1){
      this.inputText.value = oldAllString
      alert('NG')
      return
    }
    for (let i = 0;i < inStr.length;i++){
      count++
      const word = inStr[i]

      tmpLength = tmpLength + this.getEnWordSize(word)

      /* 改行 */
      let maxWidth = this.state.width * 0.85
      if (tmpSegment.type == 'imgTxt'){
        maxWidth = maxWidth * 0.6
      }
      if ((tmpLength > maxWidth) || (word == '\n')){
        lineNo++
        tmpSegment.sentences.push({id:lineNo, words:[]})
        count = 1
        wordNum = 0
        tmpLength = 0
      }
      let insWord = {
        content: inStr[i],
        color: this.colorChange.value,
        fontWeight: this.state.isBoldBtnActive ? 'bold' : 'normal',
        fontStyle: this.state.isItalicBtnActive ? 'italic' : 'normal',
        textDecoration: this.state.isUnderLineBtnActive ? 'underline' : 'none',
      }
      
      if (i <= oldAllString.length-1){
        if (sentences[lineNo] !== undefined && sentences[lineNo].words[wordNum] != undefined){
          insWord = sentences[lineNo].words[wordNum]
          wordNum++
        }
      }
      
      tmpSegment.sentences[lineNo].words.push(insWord)

    }

    tmpSegment.allString = inStr
    tmpArticle.segments[curSegmentNo] = tmpSegment
    this.setState({article:tmpArticle})
  }

  setImg (object){
    let oldArticle = this.state.article
    oldArticle.segments[this.state.curSegmentNo].dataUrl = object.img

    this.setState({article: oldArticle})
  }

  setType (object){
    let oldArticle = this.state.article
    oldArticle.segments[this.state.curSegmentNo].type = object.type

    this.setState({article: oldArticle})
  }

  addPageBreak (){
    let oldArticle = this.state.article
    oldArticle.segments[this.state.curSegmentNo].isPageBreak = true
    this.editSegments({'pattern':'add', 'type':'txtOnly'})

    this.setState({article: oldArticle})
  }

  print (){
    if (this.state.isPrint == true){
      this.PrintArticle.onClearLoadstateArray()
    }else{
      this.setState({isPrint: true})
    }
  }

  componentWillMout (){

  }
  componentDidMount (){
    this.english.checked = true
    this.inputText.focus()
  }

  componentDidUpdate (){
  }

  printFinish (){
    this.setState({isPrint: false})
  }

  keyDown (event){
    if ((event.target != this.english) && (event.target != this.japanese) && (event.target != this.inputText) && (event.target != this.saveFileTitle)){
      event.preventDefault()
    }

    if (event.keyCode == 9){
      if (this.inputText == event.target){
        if (!this.english.checked){
          this.setEnglish()
        }
        else{
          this.setJapanese()
        }
      }
    }
    if ((event.target != this.saveFileTitle)){
      this.inputText.focus()
    }
  }

  render () {

    return (
      <div>
        <PrintOrientation layout={this.state.setting.layout} />
        <DivBg onKeyDown={this.keyDown} isPrint={this.state.isPrint}>
          <DivFixed >
            <DivTitle>
              <DivFixedTitle> 4線マスター</DivFixedTitle>
              <TitleBorder>
                <InFileTitle
                  type='text'
                  placeholder='新規ファイル'
                  innerRef={(ref)=>{this.saveFileTitle = ref}}
                  onChange={this.setFileTitle} />
              </TitleBorder>
            </DivTitle>
          
            <DivMenu>
              <Menu
                ref={ref => this.Menu = ref}
                saveFileTitle={this.state.article.saveFileTitle}
                article={this.state.article}
                setting={this.state.setting}
                loadFile={this.loadFile}
                setSetting={this.setSetting}
                createNewFile={this.createNewFile}
                print={this.print}
              />
            </DivMenu>
            <DivSetLang>
              <InSetLang
                type="checkbox"
                innerRef={english => this.english = english}
                onChange={this.setEnglish}
              />
              <LabSetLang for="english">英文</LabSetLang>
              <InSetLang
                type="checkbox"
                innerRef={japanese => this.japanese = japanese}
                onChange={this.setJapanese}
              />
              <LabSetLang for="japanese">和文</LabSetLang>
            </DivSetLang>
            <DivInput>
              <TextArea
                style={{imeMode: this.state.imeMode}}
                innerRef={(input)  => {this.inputText = input}}
                onKeyUp={this.onInputKeyup}
                onKeyDown={this.onInputKeyDown}
                onChange={this.onInputChange}
              />
              <InSetColor
                type='color'
                list
                innerRef={ref => this.colorChange = ref}
                onChange={this.setColor}
              />
              <Button
                active={this.state.isBoldBtnActive}
                innerRef={ref => this.boldChange = ref}
                onClick={this.setBold}>
              B
              </Button>
              <Button
                active={this.state.isItalicBtnActive}
                innerRef={ref => this.italicChange = ref}
                onClick={this.setItalic}>
              /
              </Button>
              <Button
                active={this.state.isUnderLineBtnActive}
                ref={ref => this.underlineChange = ref}
                onClick={this.setUnderline}>
              U
              </Button>
            </DivInput>
          </DivFixed>
          <DivSegments
            innerRef={(ref) => {this.allSegs = ref}}
            width={`${this.state.width.toString()}px`}>
            <Segments
              ref={(ref) => {this.segments = ref}}
              title={this.state.article.saveFileTitle}
              name='test'
              content={this.state.article.segments}
              editSegments={this.editSegments}
              setCurSegment={this.setCurSegment}
              setting={this.state.setting}
              curSegmentNo={this.state.curSegmentNo}
              offsetHeight={this.state.segsHeight}
              setImg={this.setImg}
              setType={this.setType}
              addPageBreak={this.addPageBreak}
              width={this.state.width}
            />
          </DivSegments>
        </DivBg>
        <PrintArticle
          width={this.state.width.toString() + 'px'}
          isPrint={this.state.isPrint}
          ref={(ref) => {this.PrintArticle = ref}}
          title={this.state.article.saveFileTitle}
          content={this.state.article.segments}
          setting={this.state.setting}
          printFinish={this.printFinish} />
      </div>
    )
  }
}

export default Main
