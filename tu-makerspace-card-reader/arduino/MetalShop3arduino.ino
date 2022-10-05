int machinePinFromId[100];
bool machineStatus[100];
void writeString(String stringData) { // Used to serially push out a String with Serial.write()

  // for (int i = 0; i < stringData.length(); i++)
  // {
  //   Serial.write(stringData[i]);   // Push each char 1 by 1 on each loop pass
  // }

}

void setup()
{
  Serial.begin(9600);
  
  for (int i = 0; i < 100; i++)
  {
    machineStatus[i] = false;
  }
  // pin 1 to 10
  for (int i = 35; i<=44; i++){
    pinMode(i-35+1,OUTPUT);
    pinMode(i-35+1,OUTPUT);
    digitalWrite(i-35+1,LOW); //starts at pin 2
    machinePinFromId[i] = i-35+1; //starts at pin 8
  }
}

void loop()
{
    char delim = Serial.read();
    if(delim =='I'|delim=='O'){
      bool endMsg=false;
      String machine = "";
      while(!endMsg){
       char machineDigit = Serial.read();
       if(machineDigit=='.'){
         endMsg=true;
       }
       else if(machineDigit=='0'){
         machine = machine+'0';
       }
       else if(String(machineDigit).toInt()!=0){
          machine += machineDigit;
       }
      }
      machineStatus[machine.toInt()]=delim=='I';
      String out = delim+String(machine.toInt())+'.';
      writeString(out);
    }
    else if(delim=='R'){
      writeString("R");
      for(int i =1; i<100; i++){
        if(machineStatus[i])
        writeString(String(i)+",");
      }
    }
  for(int i =1;i<100;i++){
  if(machineStatus[i]){
    digitalWrite(machinePinFromId[i],HIGH);
  }else{
    digitalWrite(machinePinFromId[i],LOW);
  }
  }
  
}

