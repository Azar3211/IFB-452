# Seafood Supply Chain Web3 App

Welcome to the Seafood Supply Chain Web Application! This application helps track and manage seafood products from catch to consumer, ensuring transparency and quality throughout the supply chain.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A MetaMask wallet or similar Web3 wallet
- Some ETH in your wallet for gas fees (You can use Sepolia ETH)

### Installation

1. Clone this repository to your local machine
2. Open the project folder in a code editor like Visual Studio Code.
3. Inside the editor, navigate to the frontend folder.
4. Serve the project using one of the following methods (MetaMask requires HTTP, not file access)::
   Option 1: Using VS Code + Live Server
      Install the Live Server extension in VS Code.
      Right-click on index.html and choose "Open with Live Server".
      Your browser will open at http://127.0.0.1:5500/ or similar.
      MetaMask will now work correctly. (to enable it follow step 2)
    Option 2: Using Node.js and serve
      Make sure you have Node.js installed.
      Install the serve package globally (if not already):
         npm install -g serve
         cd frontend
         serve .
      Open your browser and go to the address shown (usually http://localhost:3000).

⚠️ Important: Do not open index.html by double-clicking it or using file:/// — MetaMask will not connect unless the page is served over http:// or https://.


## How to Use the Application

### 1. If you do not have metamask downloaded

1. Go to https://metamask.io/
2. Click “Download” and install the MetaMask extension for your browser.
3. After installing:
   - Click the MetaMask icon in your browser.
   - Follow the setup steps:
     - Create a new wallet or import an existing one.
     - Save your secret recovery phrase in a secure place.

### 2. Connecting MetaMask to the Application

1. Open the application (SeaTrace) in the browser
2. On the MetaMask Symbol in the extensions, you will see a globe symbol on the top right. Make sure that is green.

### 4. Connecting Your Wallet

1. Once the page is open you should be on the HomePage
2. You will see on the top right 4 buttons. Log Catch .... etc
3. Depending what role you have you can click on any of them.
4. On any of the pages there is a button that says 'Connect Wallet'. Click on that and you should get a pop up from MetaMask that says confirm
5. Once you get the notification or you see your wallet address displayed. Then you know its connected.

### 5. Navigation

The application has several main sections:

- **Home**: Overview of the supply chain
- **Log Catch**: Where you can Log seafood catches
- **Processing & Logistics**: Track and manage seafood processing
- **Certification**: View and manage certifications
- **Consumer**: Access product information and traceability

---

The following Section will detail how to use each of the functionality of the features

### 6. Log Catch

1. Navigate to the Catch Logging section.
2. Connect your wallet via MetaMask through the button.
3. Once connected Fill in the details:
   Location – Where the catch occurred

   - Vessel Name – Name of the fishing boat

   - Species – Type of seafood caught

   - Method – How the seafood was caught (e.g., net, line)

   - Quantity – Amount of seafood caught

All of these fields must be inputted. If desired you can hit the "add detail" button and add more catches 4. Once you have done everything. Hit submit catch, a pop up from MetaMask will appear, Make sure to hit confirm. IF you hit cancel, it wont process 5. After confirming the All Catches section will appear, with details and whether its verified or not. Hit Verify and optionally get details. 6. Go to the 'Go Back to Home'

### 7. Processing & Logistics

1. Go to the Processing & Logistics section.
2. Connect your wallet through the button
3. Select a Catch ID from the dropdown (only unprocessed catches will appear).
4. Fill in the required processing details:
   Packaging type
   Cleaning Notes
   Compliance Status (tick the box if compliant)
   Payment Amount (e.g., 2500)
5. Click Submit Processing and confirm the transaction in MetaMask.
6. Once processed, you can:
   View Processing Information
   Add Logistics Updates such as:
      Location
      Temperature
      Status (e.g., In Transit)
      Batch Number
      Compliance Note
   Storage Method
7. For any future updates, select the seafood and update logistics as needed.
   This can be done in the Drop Down menu for that section. If theres nothing there, then the seafood isnt processed yet

### 8. Certification
1. Head to the Certification tab.
2. Click Connect Wallet.
3. You’ll see a dropdown of seafood that’s ready to be certified.
4. Select a Seafood ID.
5. Enter the certification information:
   Inspector Name
   Notes
   Tick whether it Passed or not.
7. Click Certify and confirm the transaction in MetaMask.
9. After submission, the item moves from the To Certify dropdown to the Certified List.
9. You can also use the Get Certification Details form to look up any certified batch.
### 9. Consumer
1. Once your back at the home screen, Hit Consumer button to go to the page
2. You will see 4 buttons. 'Back to Home', 'Connect Wallet', 'Vendor', 'Consumer'
3. In this case It is recommended to hit the Vendor option as unless the food has already been given sale information, you wont be able to see the details under the consumer/customer button.
4. Connect the wallet via the button
5. Under Select Seafood ID, you should See a list of IDs, select the one you want and then fill in the details:
   Retailer Name
   Location
   Notes
(It should be noted that if you flagged the seafood failing the certification, then it wont appear here.)
6. Once you have recorded the sale through the record sale button
7. Go to the Sale Info Section, and select the id from the drop down
8. Hit get Sale info. It will then display a summary and then a qr code for you to scan
### 5. Viewing Information

- Use the "Get Info" buttons to view processing and logistics information
- All information is stored on the blockchain for transparency
- You can track the entire journey of any seafood product

## Important Notes

- Always ensure your wallet is connected before performing any actions
- Keep your MetaMask wallet secure and never share your private keys
- Make sure you have enough ETH for gas fees
- All transactions are permanent and cannot be reversed

## Troubleshooting

If you encounter any issues:

1. Make sure your wallet is properly connected
2. Check that you have enough ETH for gas fees
3. Ensure you're using a supported web browser
4. Try refreshing the page if the application seems unresponsive

## Support

For technical support or questions, please contact the development team.

## Security

- Never share your wallet's private keys
- Always verify transaction details before confirming
- Be cautious of phishing attempts
- Keep your MetaMask extension updated

## Privacy

- Your wallet address is used to identify you on the blockchain
- All transactions are public and transparent
- No personal data is stored beyond what's necessary for the supply chain

Remember: This application is designed to ensure transparency and quality in the seafood supply chain. Your participation helps maintain the integrity of the system.
