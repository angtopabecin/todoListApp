import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView ,Modal} from 'react-native';
import { useState } from 'react';
import * as SQLite from "expo-sqlite";

const homePageIcon = require('..//assets/homePageIcon.png');
const addButtonIcon = require('..//assets/addIcon.png');
const deleteButtonIcon = require('..//assets/deleteButton.png');
const settingsButtonIcon = require('..//assets/settingsButtonIcon.png');
const iButtonIcon = require('..//assets/iButtonIcon.png');
const turkeyIcon = require('..//assets/turkey.png');
const englishIcon = require('..//assets/english.png');


function HomePage() {
  
  const [tasks, setTasks] = useState([]);
  const [taskId,setTaskId] = useState(Number);
  const [taskText,setTaskText] = useState();
  const [loadingBool,setLoadingBool] = useState(true);
  const [settingsBool,setSettingsBool] = useState(false);
  const [iButtonBool,setIButtonBool] = useState(false);
  const [selected,setSelected] = useState(Boolean);
  const [control,setControl] = useState();
  const [langImage,setLangImage] = useState();

  
  
  const taskTextChange = (input) =>{
    setTaskText(input);
  }

   //tasks Db
  async function CreateDataBase() {
    try{
      const db = await SQLite.openDatabaseSync('mydatabase.db');
      await db.execAsync('CREATE TABLE IF NOT EXISTS tasks(taskId INTEGER PRIMARY KEY,taskText TEXT NOT NULL)');
    }
    catch(e){
      console.log(e);
    }
  }  

  async function InsertDataBase() {
    try {
      const db = await SQLite.openDatabaseSync('mydatabase.db');
      const result = await db.runAsync('INSERT INTO tasks(taskId,taskText) VALUES (?,?)',Number(Date.now()),taskText);
    } 
    catch (e) {
      console.log(e);  
    }
  }

  async function DeleteTaskDataBase(id) {
    try{
      const db = await SQLite.openDatabaseAsync('mydatabase.db');
      const result = await db.runAsync('DELETE FROM tasks WHERE taskId=?',Number(id));
      GetAllDataBase();
    }
    catch(e){
      console.log(e);
    }
  }

  async function GetAllDataBase () {
    try {
      const db = await SQLite.openDatabaseAsync('mydatabase.db');
      const result = await db.getAllAsync('SELECT * FROM tasks');
      setTasks(result);
      console.log(result);
    } 
    catch (e) {
      console.log(e);
    }
  }

  //languages db

  async function CreateDataBaseLang() {
    try {
      const db = await SQLite.openDatabaseSync('mydatabase.db');
      await db.execAsync('CREATE TABLE IF NOT EXISTS language(selected TEXT NOT NULL)');
      InsertDataBaseLang();
    } 
    catch (e) {
      console.log(e);    
    }
  }

  async function InsertDataBaseLang() {
    try {
      const db = await SQLite.openDatabaseSync('mydatabase.db');
      const result = await db.runAsync(`INSERT INTO language (selected) SELECT 'true' WHERE NOT EXISTS (SELECT 1 FROM language)`,);
      getAllDataBaseLang();
    } 
    catch (e) {
      console.log(e)
    }
  }

  async function UpdateLang() {
    try {
      const db = await SQLite.openDatabaseAsync('mydatabase.db');
      const result =  db.runAsync('UPDATE language SET selected = NOT selected');  
      getAllDataBaseLang();
    
    } 
    catch (e) {
      console.log(e);
    }
  }

  async function getAllDataBaseLang () {
    try {
      const db = await SQLite.openDatabaseAsync('mydatabase.db');
      const result = await db.getFirstAsync('SELECT * FROM language');
      setSelected(result.selected);
      console.log(result.selected);
    } 
    catch (e) {
      console.log(e);
    }
  }

  var titleText1;
  var titleSettings;
  var titleIButton;
  var offButton;
  var iButtonInfoText;
  var addTaskText;
 
  if(selected == 0){
    titleText1 = 'Görev';
    titleIButton = 'App Bilgileri';
    titleSettings = 'Dil Seçiniz';
    offButton = 'Kapat';
    iButtonInfoText = 'Bu To-Do Listesi uygulamasını 5 Ekim 2024 tarihinde React Native kullanarak geliştirdim.';
    addTaskText = 'Yeni Görev Ekle';
    console.log("oldu2");
  }
  if(selected == 1){
    titleText1 = 'Tasks';
    titleIButton = 'App Info';
    titleSettings = 'Choose Language';
    offButton = 'Close';
    iButtonInfoText = 'I developed this To-Do List app using React Native on October 5th, 2024.';
    addTaskText = 'Add New Task';
    console.log("oldu");
  
    
  }
  


  const addTask = () =>{
    CreateDataBase();
    InsertDataBase();
    GetAllDataBase();
    setTaskText('');
  }

  

  if(loadingBool == true){
    CreateDataBaseLang();
    getAllDataBaseLang();
    GetAllDataBase();
    if(selected == 1){
      setLangImage(turkeyIcon);
    }
    else if (selected == 0){
      setLangImage(englishIcon);
    }
    if(tasks == null){
      GetAllDataBase();
      getAllDataBaseLang();
    }
    else if(tasks != null){
      setLoadingBool(false);
    }
    if(selected == null){
      getAllDataBaseLang();
    }
    return(
      <View style={loadingStyles.container}>
        <Text>Loading...</Text>
      </View>
    )
    setLoadingBool(false);
  }

  function a() {
    UpdateLang();
    if(selected == 1){
      setLangImage(turkeyIcon);
    }
    else if (selected == 0){
      setLangImage(englishIcon);
    }
  }
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsBool}
        onRequestClose={() => {
          setSettingsBool(false);
        }}>
        <View style={{width:'94%',height:'20%',left:'2.5%',right:'2.5%',top:'35%',borderWidth:2,borderColor:'white',borderRadius:20,backgroundColor:'#72BF78'}}>
          <View style={{textAlign:'center',alignItems:'center'}}>
            <Text style={{fontSize:22}}>{titleSettings}</Text>
            <View>
              <TouchableOpacity onPress={() => a()} style={{top:'0%'}}>
                <Image source={langImage} style={{width:40,height:40,}}/>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setSettingsBool(false)}>
              <Text style={{color:'red',top:'300%'}}>{offButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={iButtonBool}
        onRequestClose={() => {
          setIButtonBool(false);
        }}>
        <View style={{width:'94%',height:'20%',left:'2.5%',right:'2.5%',top:'35%',borderWidth:2,borderColor:'white',borderRadius:20,backgroundColor:'#FFDE95'}}>
          <View style={{textAlign:'center',alignItems:'center'}}>
            <Text style={{fontSize:22}}>{titleIButton}</Text>
            <Text style={{fontSize:18}}>{iButtonInfoText}</Text>
            <TouchableOpacity
              onPress={() => setIButtonBool(false)}>
              <Text style={{color:'red',top:'240%'}}>{offButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        <TouchableOpacity style={styles.iButton} onPress={() => setIButtonBool(!iButtonBool)}>
          <Image source={iButtonIcon} style={{width:30,height:30}}/>
        </TouchableOpacity>
      <View style={{ width:'80%',height:'10%',justifyContent:'center',alignItems:'center',flexDirection:'row',textAlign:'center'}}>
        <Text style={{ bottom: '0%', fontSize: 30, fontStyle: 'normal', color: 'black'}}>{titleText1}</Text>
      </View>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsBool(!settingsBool)}>
          <Image source={settingsButtonIcon} style={{width:35,height:35}}/>
        </TouchableOpacity>
      <ScrollView style={styles.tasksView} contentContainerStyle={{ alignItems: 'center',}}>
        {tasks.map((item, index) => (
          <View key={index} style={styles.tasksBox}>
            <Text style={{fontSize:30,width:'10%',color:'white',borderWidth:2,borderColor:'white',textAlign:'center',backgroundColor:'#399918',borderRadius:30,}}>{Number(index+1)}</Text>
            <Text style={{fontSize:16,right:'0%',color:'white'}}>{item.taskText}</Text>
            <TouchableOpacity style={{left:'0%'}} onPress={() => DeleteTaskDataBase(item.taskId)}>
              <Image source={deleteButtonIcon} style={{width:20,height:20}}/>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.addTaskView}>
        <Image source={homePageIcon} style={{ width: '22.5%', height: '120%', right: '50%', bottom: '1.5%' }} />
        <TextInput style={styles.addTaskInput} value={taskText} placeholder={addTaskText} onChangeText={taskTextChange}/>
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Image source={addButtonIcon}/>
        </TouchableOpacity>
      </View>
      <StatusBar style='auto'/>
    </View>
  );
}

export default HomePage;

const loadingStyles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  }

})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFAF00',
    alignItems: 'center',
    justifyContent: 'flex-start', 
  },
  tasksView: {
    flex: 1, 
    width: '100%',
    marginTop: '-5%',
  },
  tasksBox: {
    borderWidth: 3,
    borderRadius: 20,
    borderColor: 'white',
    backgroundColor: '#7C00FE',
    width: '90%',
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addTaskView: {
    width: '100%',
    height: '8%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#7C00FE',
  },
  addTaskInput: {
    width: '52.5%',
    height: '70%',
    borderWidth: 3,
    borderRadius: 20,
    borderColor: 'white',
    right: '50%',
    textAlign: 'center',
    color: 'white',
  },
  addButton: {
    width: '11.5%',
    height: '70%',
    borderWidth: 3,
    borderRadius: 40,
    borderColor: 'white',
    backgroundColor: '#7C00FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iButton:{
    right:'42.5%',
    top:'7.5%'
  },
  settingsButton:{
    left:'42.5%',
    bottom:'6.5%'
  },
});
