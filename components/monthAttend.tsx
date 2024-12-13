import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,FlatList,Image,ScrollView} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// import { FontAwesome } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AttendanceBoard from './AttendanceBoard';
import Workers from './Workers';

const WorkerCard = ({ name, role, present, Rmdays}) => {
  return (
    <View style={styles.workerCard}>
      <Image
        style={styles.workerImage}
        source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder image
      />
      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>{name}</Text>
        <Text style={styles.workerRole}>{role}</Text>
        <Text style={styles.workerDetails}>Present: {present}</Text>
        <Text style={styles.workerDetails}>DaysLeft: {Rmdays}</Text>
      </View>
    </View>
  );
};




const monthAttend = () => {
const navigation = useNavigation();
const handleHome = () => {
    navigation.navigate("AttendanceBoard");
};

const workers = [
    { id: '1', name: 'John Doe', role: 'Chef-chanter',present:'24/30', Rmdays: '4' },
    { id: '2', name: 'John Doe', role: 'Chef-chanter',present:'21/30', Rmdays: '4' , deduction: '0FCFA' },
    { id: '3', name: 'John Doe', role: 'Chef-chanter',present:'19/30', Rmdays: '4' , deduction: '0FCFA' },
    { id: '4', name: 'John Doe', role: 'Chef-chanter',present:'26/30', Rmdays: '4' , deduction: '0FCFA' },
    { id: '5', name: 'John Doe', role: 'Chef-chanter',present:'20/30', Rmdays: '4', deduction: '0FCFA' },
  ];

  return (



    <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.headerContainer}>
        <Ionicons name="arrow-back" size={30} color="black" onPress={handleHome}/>
        <Text style={styles.headerText}>Monthly Attendance</Text>
        {/* <Ionicons name="settings" size={28} color="black" /> */}
        </View>

           
            {/* Date of today */}
            <FlatList
                    data={workers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <WorkerCard
                        name={item.name}
                        role={item.role}
                        present={item.present}
                        Rmdays={item.Rmdays}
                      />
                    )}
                    contentContainerStyle={styles.workerList}
                    // numColumns={1}
            />
    </ScrollView>
  )
}

export default monthAttend

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 16,
        paddingVertical: 60,
      },
    headerContainer:{
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        gap: 25,
    },
    headerText:{
        fontSize: 22,
        fontWeight: 'bold',
    },
    workerList: {
        // justifyContent: 'space-between',
      },
    workerCard: {
        flex: 1,
        backgroundColor: '#308830',
        margin: 8,
        borderEndColor: 'green',
        borderRadius: 8,
        padding: 12,
        shadowColor: 'green',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
      },
      workerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 8,
      },
      workerInfo: {
        alignItems: 'flex-start',
      },
      workerName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
      },
      workerRole: {
        fontSize: 14,
        color: '#eee',
        marginBottom: 4,
      },
      workerDetails: {
        fontSize: 12,
        color: '#eee',
      },


});