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
  Vue.config.devtools = true;

  Vue.component('proposal',{
    props:['title'],
    template: '#proposal',
    data: () => { 
      return {
        caseId: function() {
              if (typeof proposal === 'undefined') {
                return "case1"
              } else {
                return "case" + proposals.number.toString()
              }  
            },
        projectId: function() {
              if (typeof proposal === 'undefined') {
                return "project1"
              } else {
                return "project " + proposals.number.toString()
              }  
            },
        htmlCase : null,
        htmlProject : buildSelectHtml(projectsAll,'Name'),
        selectedCase : {
          id: null,
          name: null
        },
        selectedProject : {
          id: null,
          name: null,
        }
      }
    },
    methods: {

      dereaseProposal: function () {
        proposals.number -= 1;
      },

      selectCase : function() {
        console.log('props', this.caseId);
        let _element = document.getElementById(this.caseId);
        let _value = _element.options[_element.selectedIndex].value;
        let _text = _element.options[_element.selectedIndex].text;
        this.selectedCase.id = _value;
        this.selectedCase.name = _text;
      },

      selectAction : function() {
        let _element = document.getElementById(this.projectId);
        let _value = _element.options[_element.selectedIndex].value;
        let _text = _element.options[_element.selectedIndex].text;
        this.selectedProject.id = _value;
        this.selectedProject.name = _text;
        console.log()
        let lstCaseOfProject = matchingCase(this.selectedProject.name);
        this.htmlCase = buildSelectHtml(lstCaseOfProject,'Info')
        //console.log(this.selected.id);
        //console.log($("#projects").val());
      }
    }
  });

  var proposals = new Vue({
    el: "#proposals",
    data : {
      number : 1,
    },
    methods: {
      addNumber: function() {
        this.number +=1
      }
    }
  });

}


