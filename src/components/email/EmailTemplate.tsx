type EmailTemplateProps = {
  eventName: string;
  secretCode: string;
};

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  eventName,
  secretCode,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        margin: "10px auto",
        maxWidth: "600px",
      }}
    >
      <div
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          textAlign: "center",
          padding: "10px",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
        }}
      >
        <h1 style={{ fontSize: "24px" }}>Voting Secret For {eventName}</h1>
      </div>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ padding: "10px" }}>
          <p
            style={{
              color: "#333",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Dear Voter,
          </p>
          <p style={{ color: "#333" }}>
            You are invited to participate in {eventName} voting event. Below is
            your secret code which you will need to access the voting event in
            Vodth mobile application:
          </p>
          <div
            style={{
              color: "#f00",
              marginTop: "20px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Please keep this code confidential and do not share it with anyone.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                display: "inline-block",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                margin: "0 auto",
              }}
            >
              <span>{secretCode}</span>
            </div>
          </div>
          <p style={{ color: "#333", marginTop: "20px" }}>Best regards</p>
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#666",
            fontSize: "12px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
          }}
        >
          &copy; 2024 Vodth. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;
