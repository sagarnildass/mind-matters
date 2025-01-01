# Mind-Matters: A Multi-Modal Mental Health Assistant

**Overview**
------------

**Mind-Matters** is a state-of-the-art multi-modal mental health assistant designed to act as a supplement to trained psychiatrists. It integrates advanced AI models with real-time user interactions to provide insights, recommendations, and assistance tailored to users' mental health needs. The system leverages cutting-edge technologies in Natural Language Processing (NLP), Computer Vision, and database management to deliver a seamless, empathetic, and secure mental health support experience.

* * * * *

**Key Features**
----------------

### **1\. Multi-Modal Analysis**

-   **Sentiment Analysis**: Powered by a fine-tuned RoBERTa model to detect user sentiments with high accuracy.
-   **Suicide Prediction**: Uses the ELECTRA model to identify distress and suicidal tendencies in user interactions.
-   **Intent Recognition**: Employs a T5-based intent detection model for understanding user queries effectively.
-   **Emotion Detection**: Utilizes the FER library to analyze real-time facial expressions through video input.
-   **Visual Question Answering (VQA)**: Integrated with the "blip-vqa-base" model to interpret and respond to user-uploaded images.
-   **Speech Recognition**: Allows users to interact through voice, with added tonal analysis for nuanced understanding.

* * * * *

### **2\. Real-Time Recommendations**

-   **Article Recommendations**: Suggests mental health articles using vector-based similarity searches through Pinecone.
-   **Motivational Quotes & Exercises**: Tailored daily suggestions to uplift the user's mental state.
-   **Therapist Locator**: Uses Google Maps API to recommend nearby mental health professionals.
-   **Daily Insights**: Provides summaries of user interactions, highlighting key emotional trends.

* * * * *

### **3\. User-Centric Design**

-   **Personalized Interactions**: GPT-3.5 bot fine-tuned with RAG and PEFT pipelines for empathetic and meaningful conversations.
-   **User Profiles**: Stores demographic and interaction data securely for personalized assistance.
-   **Emergency Support**: Detects critical mental health states and alerts emergency contacts as needed.
-   **Group Support**: Enables focus group creation with similar users (consent-based).

* * * * *

### **4\. Robust Backend Architecture**

-   **FastAPI Backend**: Deployed as microservices in a Kubernetes cluster, ensuring horizontal and vertical scalability.
-   **PostgreSQL & Pinecone Databases**: Efficiently manage raw data and high-dimensional vector embeddings.
-   **Caching with Redis**: Enhances performance by caching frequently accessed data.
-   **AWS Deployment**: Backend and frontend hosted in AWS environments for high availability.

* * * * *

**Technical Implementation**
----------------------------

### **1\. Core Modules**

#### **AI-Based Analysis**

-   **RoBERTa**: Fine-tuned for sentiment detection in mental health contexts.
-   **ELECTRA**: Identifies subtle cues for suicidal tendencies with high efficiency.
-   **T5 for Intent Recognition**: Provides intent categorization for user queries.
-   **FER for Emotion Detection**: Real-time facial expression analysis ensures accurate emotional feedback.

#### **User Interaction**

-   **Websocket Communication**: Enables real-time chat and video analysis.
-   **Secure Chat Logs**: Encrypts and stores user interactions for retrospective insights.

#### **Database Management**

-   **PostgreSQL**: Manages structured user data.
-   **Pinecone Vector Database**: Stores embeddings for fast similarity searches.

* * * * *

### **2\. Scalability & Security**

-   **Microservices Architecture**: Facilitates seamless scaling for concurrent users.
-   **Ingress & Load Balancing**: Supports efficient traffic management.
-   **CORS Middleware**: Ensures secure communication between frontend and backend.
-   **Encrypted Sessions**: Protects user data in transit and at rest.

* * * * *

**Advantages**
--------------

1.  **Real-Time Insights**: Instantaneous feedback ensures timely assistance.
2.  **Empathetic Interactions**: Fine-tuned AI models mimic human empathy for better user engagement.
3.  **Safety-Oriented Design**: Detects and acts on critical mental health risks.
4.  **Scalability**: Designed to support hundreds of thousands of concurrent users.
5.  **Data-Driven Recommendations**: Advanced vector-based methods provide personalized and contextually relevant content.

* * * * *

**Future Scope**
----------------

-   Integration of more AI models for enhanced analysis.
-   Expanding functionalities to support diverse user needs.
-   Enhanced group therapy support and gamified challenges for mental health improvement.

* * * * *

**Getting Started**
-------------------

### **1\. Clone the Repository**

bash

Copy code

`git clone https://github.com/sagarnildass/mind-matters.git`

### **2\. Install Dependencies**

-   Backend: Install Python packages

    bash

    ```
    cd backend
    pip install -r requirements.txt
    ```

-   Frontend: Navigate to the `frontend` directory and install dependencies

    bash

    Copy code

    `npm install`

### **3\. Configure Environment Variables**

Set up `.env` files for backend and frontend, including:

-   Database credentials
-   API keys (Google Maps, Pinecone, etc.)
-   JWT secret keys for user authentication

### **4\. Run the Application**

-   Start the backend:

    ```
    cd backend
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```

-   Start the frontend:


    ```
    cd frontend
    npm run dev
    ```

* * * * *

**Contributing**
----------------

Contributions are welcome! Feel free to fork the repository, submit pull requests, or raise issues for any bugs or feature requests.

* * * * *

**License**
-----------

This project is licensed under the MIT License.

* * * * *

**Mind-Matters** is a step towards bridging the gap between technology and mental health care. Together, we can make mental health support accessible and impactful for everyone.



## Deployment Guide

### Backend

#### Push Docker image to ECR

1. ```docker build -t mental-health:v1 .```
2. test the image - ```docker run --rm --gpus all -p 8000:8000 --name "artelus-mental-health" mental-health:v1```
3. ```aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 163021050982.dkr.ecr.ap-south-1.amazonaws.com```
4. ```docker tag mental-health:v1 163021050982.dkr.ecr.ap-south-1.amazonaws.com/mental-health:v1```
5. ```docker push 163021050982.dkr.ecr.ap-south-1.amazonaws.com/mental-health:v1```

#### Make Kubernetes cluster ready for AWS Load Balancer Controller (as ELB does not support Websockets)

First we have to install the Load Balancer Controller.

1. Retrieve the OIDC ID for your EKS cluster - ```aws eks describe-cluster --name your-cluster-name --query "cluster.identity.oidc.issuer" --output text | sed -e "s/^https:\/\///"```
2. Create an IAM policy named ALBIngressControllerIAMPolicy from the AWS Management Console or using the AWS CLI. You can get the policy document from the [official AWS documentation](https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/main/docs/install/iam_policy.json).
3. Create a IAM service account role and attach the above policy: 
```
eksctl create iamserviceaccount \
  --region ap-south-1 \
  --name aws-load-balancer-controller \
  --namespace kube-system \
  --cluster artelus-cluster \
  --attach-policy-arn arn:aws:iam::163021050982:policy/ALBIngressControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --approve
```
4. Now an important part! We have to modify the policy slightly to get rid of a permission error regarding the addTags. Refer to this [article](aws_tag_resource.MD).

5. Based on this, our final policy would look like [this JSON](ALBIngressControllerPolicy.json).

#### Install the actual AWS Load Balancer Controller

1. ```kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller/crds?ref=master"```
2. Add and upgrade the helm repo
```
helm repo add eks https://aws.github.io/eks-charts
```
```
helm upgrade -i aws-load-balancer-controller eks/aws-load-balancer-controller \
  --set clusterName=your-cluster-name \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  -n kube-system
```
3. Check the ingress - ```kubectl get deployment -n kube-system aws-load-balancer-controller```
4. Apply the app.yaml - ```kubectl apply -f app.yaml```
5. Check that the ingress has a proper ALB endpoint: ```kubectl get ingress artelus-mental-health-ingress```
6. In route53, create an A record with Alias to this ALB endpoint. The hostname should match the one in the app.yaml (in our case, it is https://mentalhealthapi.artelus.in)
7. Once the changes are propagated (which can take a little time), you should be able to access your service through https://mentalhealthapi.artelus.in/.

### Frontend

We are using AWS amplify to deploy this app. Following are the steps to replicate the deployment.

1. Install AMPLIFY CLI - curl -sL https://aws-amplify.github.io/amplify-cli/install | bash && $SHELL

2. Configure Amplify

```
amplify configure
```

amplify configure will ask you to sign into the AWS Console.

Once you're signed in, Amplify CLI will ask you to create an IAM user.

```
Specify the AWS Region
? region:  # Your preferred region
Follow the instructions at
https://docs.amplify.aws/cli/start/install/#configure-the-amplify-cli

to complete the user creation in the AWS console
https://console.aws.amazon.com/iamv2/home#/users/create
```

Navigate to the IAM User creation page if it's not already open.

Enter a User name and select Next. You can name the user anything.

![AWS User](https://docs.amplify.aws/images/cli/user-creation/user-name.png)

Select Attach policies directly and select AdministratorAccess-Amplify as the Permissions policy. Select Next.

On the Review page, check that everything looks good and select Create user.

This will redirect to the users list page. Select the user you just created.

Create Access Keys for this user and save them.

3. Initialize Amplify

- ```amplify init```

- Enter a name for the project

- Initialize the project with above configuration - Select "No" here.

- Enter a name for the environment - enter a name

- Choose your default editor - enter your editor

- Choose the type of app you are building - javascript

- What javascript framework are you using - React

- Source Directory Path - src

- Distribution Directory path - build 

  - For this we changed the vite.config.js file as follows as by default the build folder is called "dist"

```
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [react()],
    build: {
      outDir: "build",
    },
    server: {
      watch: {
       usePolling: true,
    },
      host: true, // Here
      strictPort: true,
      port: 5173, // you can replace this port with any port
  }})

```

- Build command - npm run build

- Start command - npm run dev

- Authentication Method - AWS Profile

Now it will create the whole backend. An "Amplify" directory will be created.

- Create a file called amplify.yml like this

```
version: 1
backend:
  phases:
    build:
      commands:
        - '# Execute Amplify CLI with the helper script'
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    # IMPORTANT - Please verify your build output directory
    baseDirectory: build/ #this is what changes from the default one
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

At this point in time, push the codes to git as we will create CI-CD from git.

4. Add hosting

- ```amplify add hosting```

- Select "Hosting with Amplify Console"

- Choose a type - Continuous Deployment.

- Hit enter. You will be now redirected to the AWS Amplify Console.

5. AWS Amplify frontend configure

- Go to "Hosting Environments"

- Select Github

- Give proper permission and select the repo and the branch and click next.

- In the next step (build settings), choose the environment. Also change the baseDirectory to "frontend/build/"

- Check the CI/CD tickbox.

- Select a backend role. If you did not create this role, create it.

- It will automatically detect the amplify.yml as the config file.

- Click "Next", and then "Submit".

- Now once the deployment is done, we will manually attach a custom domain to this app.

6. Configure certificates and subdomains

- Go to Domain Management.

- Add "artelus.in" as the domain.

- In subdomains, enter "mindmatters.artelus.in"

- Disable "artelus.in"

- Click submit. Now you can access your app at https://mindmatters.artelus.in

1. Add Redirect Rules (For avoiding the XML permission denied error)

- Source Address - ```</^((?!\.(css|gif|ico|jpg|js|png|txt|svg|woff|ttf)$).)*$/>```

- Target Address - ```/index.html```

- Type - ```200```

- Country Code - Leave Blank



# Potential Homepage features

## Right Side of the Screen:

### 1. User Profile Preview
- Displayed at the very top-right corner.
- A small circular profile picture with the user's name next to it.
- Clicking on the profile can open a dropdown with options like 'Settings', 'Profile', and 'Log Out'.

### 2. Notifications
- Below the profile, have a bell icon indicating notifications.
- Clicking on the bell can open a dropdown list of recent notifications.
- Highlight any unread notifications.

### 3. Recent Chat Summary
- Display a card with the title "Recent Chat".
- Show the last few lines of the chat.
- Below the snippet, provide a "Continue Chat" button.

### 4. Feedback Reminder
- If feedback is pending, show a gentle reminder card below the Recent Chat card.
- This card can be dismissable.

### 5. Quick Actions
- Below the feedback reminder, have a row or grid of icon buttons for quick actions.
- Use clear icons with tooltips on hover to indicate their function.
- Examples: Start a New Chat, View Interaction History, Emergency Contacts.

### 6. Tips or Quotes
- At the bottom, display a rotating quote or tip card.
- This can act as a footer for the right side.

## Additional Ideas:

### 7. Mood History Graph
- A compact graph showing the user's mood trends over the past week.
- Can use different colors or emojis to represent various moods.

### 8. Upcoming Appointments or Reminders
- If the system has any scheduling or reminder functionality, display upcoming appointments or tasks.

### 9. Personalized Insights
- Using AI or analysis, provide insights such as "Your mood has been predominantly positive this week!" or "You've chatted 30% more than the last week."

### 10. Feedback Insights
- If the user has given feedback, show a summary or insights from it. For example, "From your last feedback, you felt the session was helpful!"

### 11. Daily Challenges or Tasks
- Propose small challenges or tasks for the user, like "Share a happy memory today!" or "Try a 5-minute meditation."

### 12. Integration with External Apps
- If feasible, having integrations with popular wellness apps or platforms can be helpful.
- Displaying data like "You walked 5000 steps today!" from a fitness app can be motivating.
