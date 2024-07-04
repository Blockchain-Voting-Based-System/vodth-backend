import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import CSVReader from "react-csv-reader";
import { renderToString } from "react-dom/server";
import { firestore } from "../../firebase";
import { useGenerateSecret } from "../../services/useGenerateSecret";
import EmailTemplate from "../email/EmailTemplate";

interface CsvUploaderProps {
  eventName: string;
  eventRef: any;
}

const CsvUploader: React.FC<CsvUploaderProps> = ({eventName, eventRef}) => {
  const [csvData, setCsvData] = useState<any[]>([]);

  const handleFileLoaded = (data: any) => {
    console.log("File loaded");
    setCsvData(data);
  };

  const handleUploadCsv = async () => {
    try {
      console.log("Uploading CSV data");
      const eventDocRef = doc(firestore, "events", eventRef);
      const eventSnapshot = await getDoc(eventDocRef);
      let voterSecrets = [];

      if (eventSnapshot.exists()) {
        // Check if the 'voterSecrets' field exists and has content
        voterSecrets = eventSnapshot.data().voterSecrets || [];
      }

      for (const row of csvData) {
        if (row.email === "") {
          continue;
        }

        // Generate a hash of the email and add it as the 'secret' field
        const secret = useGenerateSecret(row.email);
        row.secret = secret;

        // Append the new voter data to the voterSecrets array
        voterSecrets.push(secret);

        // Render the EmailTemplate component to HTML
        const emailHtml = renderToString(
          <EmailTemplate eventName={eventName} secretCode={secret} />,
        );

        // Construct the email payload
        const emailPayload = {
          to: [row.email],
          message: {
            subject: `Vodth, Voting Secret for ${eventName}`,
            html: emailHtml,
            event: eventName,
            // You might need to adjust the voterDocPath or remove it since we're not creating individual voter documents now
          },
        };

        // Add emailPayload to the mail collection
        const emailCollection = collection(firestore, "mail");
        await addDoc(emailCollection, emailPayload);
      }

      // After the loop, update the event document with the new voterSecrets array
      await updateDoc(eventDocRef, { voterSecrets: voterSecrets });
    } catch (error) {
      console.error("Error uploading CSV data: ", error);
    }

    console.log("CSV data uploaded");
  };

  return (
    <>
      <CSVReader
        parserOptions={{ header: true }}
        onFileLoaded={handleFileLoaded}
      />
      <button className="bg-blue-500 px-10 py-2" onClick={handleUploadCsv}>
        Upload
      </button>
    </>
  );
};

export default CsvUploader;
