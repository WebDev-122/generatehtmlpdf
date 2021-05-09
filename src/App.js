import React, { useState, useCallback, useMemo } from 'react';
import { uuid } from 'lodash-uuid';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// Material UI
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  makeStyles,
  Button,
  Grid,
  ButtonGroup
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// Material UI
import PictureAsPdf from '@material-ui/icons/PictureAsPdf';
import SubjectOutlinedIcon from '@material-ui/icons/SubjectOutlined';
import AddIcon from '@material-ui/icons/Add';
import XLSX from "xlsx";
import DataInput from './components/DataInput';
import Editor from './components/Editor';

import './App.css';

const appbarStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const contentStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: '40px'
  },
  textfield: {
    width: '100%',
    color: theme.palette.text.secondary,
  },
  colunmnButton: {
    color: theme.palette.text.primary,
  },
  spacing: 4
}));


function App() {

  const TAB_STATE = useMemo(() => ({
    HTML_TAB_ID: 1,
    PDF_TAB_ID: 2,
    EDIT_TAB_ID: 3
  }), [])

  const [colData, setColData] = useState([])
  const [chooseTab, setChooseTab] = useState(TAB_STATE.EDIT_TAB_ID)

  const appClasses = appbarStyles();
  const contentClasses = contentStyles();

  const addRowCount = useCallback((e) => {
    setColData(d => [...d, {
      id: uuid(),
      content: ''
    }]);
  }, []);

  //add rows from an excel file
  const addRowsFromExcel = useCallback((excelData) => {
    for (const key in excelData) {
      const excelDataRow = excelData[key];
      setColData(d => [...d, {
        id: uuid(),
        content: excelDataRow[0] ? `${excelDataRow[0]}` : ''
      }]);
    }
  }, []);

  //event which tabs are clicked (edit & html)
  const onTABClick = useCallback((targetId) => {
    if (targetId === chooseTab) return;
    setChooseTab(targetId);
  }, [chooseTab])

  //event which exports as pdf
  const onPrintDocument = useCallback(() => {
    const input = document.getElementById('pdfdiv');
    html2canvas(input)
      .then((canvas) => {
        // const imgWidth = 200;
        // const imgHeight = canvas.height * imgWidth / canvas.width;
        // const imgData = canvas.toDataURL('image/png');
        // const position = 0;
        // const pdf = new jsPDF('p', 'pt', 'a4');
        // pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        // pdf.save("download.pdf");
        const pdf = new jsPDF({
          unit: "px",
          format: "letter",
          userUnit: "px",
        })
        pdf.html(input, { html2canvas: { scale: 0.57 } }).then(() => {
          pdf.save("download.pdf")
        })
      });
  }, []);

  //event which exports as html
  const onDownloadHTML = useCallback(() => {
    const doc = document.implementation.createHTMLDocument("DownloadDoc")
    const styles = document.getElementsByTagName("style")
    const newDiv = document.createElement("div")
    const newStyle = document.createElement("style")
    newDiv.innerHTML = document.getElementById("pdfdiv").innerHTML

    let styleContent = ""
    for (const style of styles) {
      styleContent += style.innerHTML
    }
    newStyle.innerHTML = styleContent
    doc.head.appendChild(newStyle)
    doc.body.appendChild(newDiv)

    const tempEl = document.createElement("a")
    tempEl.href =
      "data:text/html;charset=utf-8," +
      encodeURIComponent(doc.documentElement.innerHTML);
    tempEl.target = "_blank"
    tempEl.download = "page.html"
    tempEl.click()
  }, []);

  //event which handles to import an excel file
  const handleFile = useCallback((file) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = ({ target: { result } }) => {
      const wb = XLSX.read(result, { type: rABS ? "binary" : "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      addRowsFromExcel(data);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  }, [addRowsFromExcel]);

  return (
    <Container>
      <Container className={appClasses.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={appClasses.title}>
              Generate HTML & PDF
            </Typography>
            <ButtonGroup variant="contained" color="primary">
              <DataInput handleFile={handleFile} disableState={chooseTab !== TAB_STATE.HTML_TAB_ID ? false : true}/>
              <Button id={TAB_STATE.EDIT_TAB_ID} onClick={() => onTABClick(TAB_STATE.EDIT_TAB_ID)} >EDIT</Button>
              <Button id={TAB_STATE.HTML_TAB_ID} onClick={() => onTABClick(TAB_STATE.HTML_TAB_ID)} >HTML</Button>
            </ButtonGroup>
            <IconButton color="inherit" aria-label="menu" onClick={onPrintDocument} disabled={chooseTab !== TAB_STATE.HTML_TAB_ID}>
              <PictureAsPdf />
            </IconButton>
            <IconButton color="inherit" aria-label="menu" onClick={onDownloadHTML} disabled={chooseTab !== TAB_STATE.HTML_TAB_ID}>
              <SubjectOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Container>

      <Container className={contentClasses.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent id="pdfdiv" elevation={4} style={{ padding: '20px' }}>
                <Container>
                  <Grid container spacing={2}>
                    {colData.map((item) => (
                      <Grid item xs={12} key={item.id}>
                        <Editor htmlViewState={chooseTab===TAB_STATE.HTML_TAB_ID ? true : false} initialValue={item.content}/>
                      </Grid>
                    ))}
                    {chooseTab === TAB_STATE.EDIT_TAB_ID && (
                      <Grid item sm={12}>
                        <Button variant="contained" color="primary" onClick={addRowCount}>
                          <AddIcon></AddIcon>Add Row
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Container>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}

export default App;