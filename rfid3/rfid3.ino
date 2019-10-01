#include <MFRC522.h> //library responsible for communicating with the module RFID-RC522
#include <SPI.h> //library responsible for communicating of SPI bus
#include <WiFi.h>
#include <HTTPClient.h>

#define SS_PIN    21
#define RST_PIN   22
#define SIZE_BUFFER     18
#define MAX_SIZE_BLOCK  16

const char* ssid = "Wireless Infrastructure 1";
const char* password =  "waredebuhove61";

//used in authentication
MFRC522::MIFARE_Key key;
//authentication return status code
MFRC522::StatusCode status;
// Defined pins to module RC522
MFRC522 mfrc522(SS_PIN, RST_PIN); 
// Init array that will store new NUID
byte nuidPICC[4];
// Card ID in string
String cardId = "";

int LED_BUILT = 2;

void setup() 
{
  Serial.begin(9600);
  pinMode(LED_BUILT, OUTPUT);
  delay(4000);
  WiFi.begin(ssid, password); 
  while (WiFi.status() != WL_CONNECTED) { //Check for the connection
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network!");
  Serial.println("Starting SPI bus...");
  SPI.begin(); // Init SPI bus
  
  // Init MFRC522
  mfrc522.PCD_Init(); 
  Serial.println("Ready to scan card!");
  Serial.println();

  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
}

void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
}

void loop() 
{
   // Aguarda a aproximacao do cartao
   //waiting the card approach
  if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return;
  }
  // Select a card
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }

    // Dump debug info about the card; PICC_HaltA() is automatically called
    //  mfrc522.PICC_DumpToSerial(&(mfrc522.uid));</p><p>  //call menu function and retrieve the desired option
  for (byte i = 0; i < 4; i++) {
      nuidPICC[i] = mfrc522.uid.uidByte[i];
  }

    char str[12];

    unsigned char * pin = nuidPICC;
    const char * hex = "0123456789ABCDEF";
    char * pout = str;
    for(; pin < nuidPICC+sizeof(nuidPICC); pout+=3, pin++){
        pout[0] = hex[(*pin>>4) & 0xF];
        pout[1] = hex[ *pin     & 0xF];
        pout[2] = ':';
    }
    pout[-1] = 0;

    printf("%s\n", str);

    if(WiFi.status()== WL_CONNECTED)
    {
     HTTPClient http;
     http.begin("http://103.7.41.173:3002/registry");  //Specify destination for HTTP request
     http.addHeader("Content-Type", "text/plain");
     int httpResponseCode = http.POST(str);   //Send the actual POST request
 
     if(httpResponseCode>0){
   
      String response = http.getString();                       //Get the response to the request
   
      Serial.println(httpResponseCode);   //Print return code
      Serial.println(response);           //Print request answer

      if(response.equals("OK"))
      {
        for (int q=1;q<6;q++)
        {
          digitalWrite(LED_BUILT, HIGH);
          delay(300);
          digitalWrite(LED_BUILT, LOW);
          delay(300);
        }
      }
   
     }else{
   
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
   
     }
   
     http.end();  //Free resources
   
   } else {
   
      Serial.println("Error in WiFi connection");   
   
   }
   Serial.println("Delay in 2s...");
   delay(2000);
 
//instructs the PICC when in the ACTIVE state to go to a "STOP" state
  mfrc522.PICC_HaltA(); 
  // "stop" the encryption of the PCD, it must be called after communication with authentication, otherwise new communications can not be initiated
  mfrc522.PCD_StopCrypto1();  
}
