describe("Chat Application E2E", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("should log in, send a message, and see the bot response", () => {
    cy.intercept("POST", "**/api/chat", (req) => {
      cy.log("📢 Intercepted Request:", req);
      if (req.body.message === "Hello bot!") {
        req.reply({
          statusCode: 200,
          body: { author: "Bot", content: "Hi Jhon!", isNew: false },
        });
      }
    }).as("sendMessage");

    cy.get("input[placeholder='Enter your name']").type("Jhon");
    cy.contains("Start Chat").click();

    cy.url().should("include", "/chat");

    cy.get("input[placeholder='Type a message...']").type("Hello bot!");
    cy.get("button").contains("Send").click();

    cy.wait("@sendMessage", { timeout: 20000 }).then(() => {});

    cy.contains("Jhon: Hello bot!", { timeout: 20000 }).should("exist");

    cy.contains("Bot is typing...", { timeout: 10000 }).should("exist");

    cy.contains("Bot: Hi Jhon!", { timeout: 20000 }).should("be.visible");
  });

  it("should navigate to the admin page", () => {
    cy.visit("/chat");

    cy.get("button").contains("Admin Panel").click();

    cy.url().should("include", "/admin");
  });

  it("should log out and redirect to home", () => {
    cy.visit("/chat");

    cy.get("button").contains("Logout").click();

    cy.url().should("eq", "http://localhost:3000/");
    cy.get("input[placeholder='Enter your name']").should("exist");
  });
});
