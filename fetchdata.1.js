'use strict';

const APIKEY = 'keyKfVuiM6CHUTRrF';
var Airtable = require('airtable');
var base  = new Airtable({
  apiKey:APIKEY
}).base(
  'appTIRFofu4KqVvJY'
)
var casesAll = [];
var projectsAll = [];


// function listAccount() {
//   base('Tài Khoản').select({
//     view : "Full",
//     cellFormat : "json"

//   }).eachPage(function page(records, fetchNextPage) {
//     records.forEach(record => {
//       console.log('#####');
//       console.log(record.get('Tài khoản'));
//     });
//     fetchNextPage();
//   }, function done(err) {
//     if(err) {
//       throw new Error('Fetching was failed',err)
//     }
//   })
// }
listProjects()
function listProjects() {
  base('Dự án').select({
    view: "Grid view",
    cellFormat : 'json'
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        //console.log('name', record.get('Name'));
        projectsAll.push(record)
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
    listCases()
});
}

function listCases(projectName) {
  base('Sổ cái').select({
    // Selecting the first 3 records in 00_Total:
    view: "00_Total",
    cellFormat: "json"
  }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function(record) {
          //console.log('Retrieved', record.get('Info'));
          casesAll.push(record)
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

  }, function done(err) {
      if (err) { console.error(err); return; };
      actionOnReady()
  });

}

function getAtrribute(data,attr) {
  let _return = data.map(
    record => record.get(attr)
  )
  return _return.filter(record => typeof record !== 'undefined')
}

function buildSelectHtml(data,property) {
  return data.map(record => {
    // return `<option value=${record.id}>${record.get(property)}</option>`
    return {
      id : record.id,
      text:record.get(property)
    }
  })
}

function matchingCase(nameOfProject) {
  let _lstInfo = [];
  casesAll.forEach(record => {
    let _info = record.get('Info')
    if(_info.indexOf(nameOfProject) >=0) {
      _lstInfo.push(record)
    }
  });
  return _lstInfo;
}

function actionOnReady() {
  // let namesOfProject = getAtrribute(projectsAll,'Name');
  // let infoOfLedger = getAtrribute(casesAll,'Info');
  console.log(buildSelectHtml(projectsAll,'Name'));
  Vue.config.devtools = true

  var cases = new Vue({
    el: "#cases",
    data: {
      htmls : null,
      selected : {
        id: null,
        name: null
      }
    },
    methods: {
      selectCase : function() {
        let _element = document.getElementById('cases');
        let _value = _element.options[_element.selectedIndex].value;
        let _text = _element.options[_element.selectedIndex].text;
        this.selected.id = _value;
        this.selected.name = _text;
      }
    }
  })
  // console.log(cases);
  var projects = new Vue({
    el : "#projects",
    data: {
      htmls : buildSelectHtml(projectsAll,'Name'),
      selected : {
        id : null,
        name: null
      }
    },
    methods: {
      selectAction : function() {
        let _element = document.getElementById('projects');
        let _value = _element.options[_element.selectedIndex].value;
        let _text = _element.options[_element.selectedIndex].text;
        this.selected.id = _value;
        this.selected.name = _text;
        let lstCaseOfProject = matchingCase(this.selected.name);
        cases.htmls = buildSelectHtml(lstCaseOfProject,'Info')
        console.log(this.selected.id);
        //console.log($("#projects").val());
      }
    }
  });

}


