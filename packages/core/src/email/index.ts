import { Resource } from "sst";

export module Email {
  export async function bulkSend({
    subject,
    htmlContent,
    messageVersions,
  }: {
    subject: string;
    htmlContent: string;
    messageVersions: {
      to: { email: string; name: string }[];
      htmlContent?: string;
      subject?: string;
    }[];
  }) {
    const body = JSON.stringify({
      sender: {
        email: "notifications@nsforum.net",
        name: "The Network Society Forum",
      },
      subject,
      htmlContent,
      messageVersions,
    });

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      body,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": Resource.BREVO_API_KEY.value,
      },
    });

    if (!res.ok) {
      const error = new Error(`HTTP error! status: ${res.status}`);
      console.error(error);
      throw error;
    }

    return (await res.json()) as { messageIds: string[] };
  }
}
