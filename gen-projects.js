#!/usr/bin/env node
var fs=require('fs'),path=require('path');
var BASE='C:/Users/frumk/Desktop/ASS-OS/konomi/github/KCC/controls/GITNITION/projects';

function mk(d){fs.mkdirSync(d,{recursive:true})}
function wr(f,o){fs.writeFileSync(f,JSON.stringify(o,null,2))}
function res(actor){return{scope:'A',version:1,files:['view.json'],attributes:{},lastModification:{actor:actor||'gitnition',timestamp:Date.now()}}}

function makeProject(name,cfg){
  var b=path.join(BASE,name); mk(b);
  wr(b+'/project.json',{title:cfg.title,description:cfg.desc,parent:'',enabled:true,inheritable:false});
  var pc=b+'/com.inductiveautomation.perspective/page-config'; mk(pc);
  var pages={};
  cfg.pages.forEach(function(p){pages[p.url]={title:p.title,viewPath:p.view}});
  wr(pc+'/config.json',{pages:pages});
  wr(pc+'/resource.json',{scope:'G',version:1,files:['config.json'],lastModification:{actor:'gitnition',timestamp:Date.now()}});
  cfg.views.forEach(function(v){
    var d=b+'/com.inductiveautomation.perspective/views/'+v; mk(d);
    wr(d+'/view.json',{custom:{},params:{},props:{defaultSize:{width:1920,height:1080}},root:{type:'ia.container.coord',meta:{name:'root'},children:[]}});
    wr(d+'/resource.json',res());
  });
  if(cfg.udts)cfg.udts.forEach(function(u){
    var d=b+'/gw-resources/tags/types/'+u.name; mk(d);
    wr(d+'/nodeconfig.json',{tagType:'UdtType'});
    Object.keys(u.m||{}).forEach(function(k){mk(d+'/'+k);wr(d+'/'+k+'/nodeconfig.json',u.m[k])});
  });
  if(cfg.tags)cfg.tags.forEach(function(t){
    var d=b+'/gw-resources/tags/instances/'+t.p; mk(d);
    wr(d+'/nodeconfig.json',{tagType:'UdtInstance',typeId:t.t});
  });
  var n=0;(function w(d){fs.readdirSync(d).forEach(function(f){var fp=path.join(d,f);fs.statSync(fp).isDirectory()?w(fp):n++})})(b);
  return n;
}

var F8={tagType:'AtomicTag',dataType:'Float8',value:0};
var BOOL={tagType:'AtomicTag',dataType:'Boolean',value:false};

var n1=makeProject('water-treatment',{
  title:'Water Treatment Plant',desc:'Municipal WTP',
  pages:[{url:'/',title:'Overview',view:'Plant/Overview'},{url:'/Intake',title:'Intake',view:'Plant/Intake'},{url:'/Filter',title:'Filter',view:'Plant/Filter'},{url:'/Distribution',title:'Distribution',view:'Plant/Distribution'}],
  views:['Plant/Overview','Plant/Intake','Plant/Filter','Plant/Distribution','Docks/Header','Docks/Nav','Templates/PumpCard','Templates/AnalyzerCard'],
  udts:[
    {name:'WTP/Pump',m:{Running:BOOL,Amps:{...F8,engUnit:'A'},Speed:{...F8,engUnit:'RPM'}}},
    {name:'WTP/Analyzer',m:{PV:F8,Unit:{tagType:'AtomicTag',dataType:'String',value:'ppm'}}},
  ],
  tags:[{p:'WTP/Intake/P001',t:'WTP/Pump'},{p:'WTP/Intake/P002',t:'WTP/Pump'},{p:'WTP/Filter/Turbidity',t:'WTP/Analyzer'},{p:'WTP/Distribution/P101',t:'WTP/Pump'}],
});
console.log('✓ water-treatment:',n1,'files');

var n2=makeProject('brewery',{
  title:'Craft Brewery',desc:'Brewhouse + fermentation',
  pages:[{url:'/',title:'Brewhouse',view:'Brew/Overview'},{url:'/Mash',title:'Mash',view:'Brew/Mash'},{url:'/Fermentation',title:'Fermentation',view:'Brew/Fermentation'},{url:'/CIP',title:'CIP',view:'Brew/CIP'}],
  views:['Brew/Overview','Brew/Mash','Brew/Fermentation','Brew/CIP','Docks/Header','Docks/Nav','Templates/VesselCard','Templates/TempPID'],
  udts:[
    {name:'Brew/Vessel',m:{Level:F8,Temp:{...F8,engUnit:'°F'},Pressure:{...F8,engUnit:'psi'}}},
    {name:'Brew/TempLoop',m:{PV:F8,SP:F8,Output:{...F8,engUnit:'%'}}},
  ],
  tags:[{p:'Brew/MashTun',t:'Brew/Vessel'},{p:'Brew/BoilKettle',t:'Brew/Vessel'},{p:'Brew/FV001',t:'Brew/Vessel'},{p:'Brew/FV002',t:'Brew/Vessel'},{p:'Brew/MashTemp',t:'Brew/TempLoop'}],
});
console.log('✓ brewery:',n2,'files');

var n3=makeProject('hvac',{
  title:'HVAC Building Automation',desc:'AHU + chiller + zones',
  pages:[{url:'/',title:'Building',view:'HVAC/Overview'},{url:'/AHU',title:'AHU',view:'HVAC/AHU'},{url:'/Zones',title:'Zones',view:'HVAC/Zones'}],
  views:['HVAC/Overview','HVAC/AHU','HVAC/Zones','Docks/Header','Docks/Nav','Templates/AHUCard','Templates/ZoneCard'],
  udts:[
    {name:'HVAC/AHU',m:{SupplyTemp:F8,ReturnTemp:F8,FanSpeed:F8}},
    {name:'HVAC/Zone',m:{Temp:F8,SP:F8,Damper:{...F8,value:50}}},
  ],
  tags:[{p:'HVAC/AHU1',t:'HVAC/AHU'},{p:'HVAC/AHU2',t:'HVAC/AHU'},{p:'HVAC/Zone1',t:'HVAC/Zone'},{p:'HVAC/Zone2',t:'HVAC/Zone'},{p:'HVAC/Zone3',t:'HVAC/Zone'}],
});
console.log('✓ hvac:',n3,'files');

console.log('\nTotal:',n1+n2+n3,'files across 3 projects');
