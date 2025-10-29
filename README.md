# 🧪 JMeter Performance Testing with GitHub Actions + Grafana + InfluxDB

This project showcases how to run **Automated JMeter Performance Tests** using:
- ✅ Apache JMeter (with BZM Concurrency Thread Group)
- ✅ GitHub Actions CI
- ✅ Grafana + InfluxDB integration
- ✅ Automated HTML report publishing to GitHub Pages

---

## 📊 Live Test Report

> Latest run:  
👉 [View HTML Performance Report](https://danielfifiita.github.io/jmeter-performance-ci/)

---

## 🧰 Tech Stack

| Tool            | Purpose                                |
|-----------------|-----------------------------------------|
| JMeter          | Performance Testing Framework           |
| InfluxDB        | Time-series DB for metrics              |
| Grafana         | Visualize test results in real-time     |
| GitHub Actions  | CI automation for test execution        |
| Docker          | Containerized environment for tools     |

---

## 🚀 Getting Started

### 🐳 Requirements:
- Docker Desktop
- Git
- Java 8–17
- GitHub Account

### Optional:
- Jmeter ( for local usage)

---

### 📂 Folder Structure

```
📦 jmeter-performance-ci 
        ┣ 📂 .github/
        ┃ ┗ 📂 workflows/
        ┃ ┗ jmeter-test.yml # GitHub Actions workflow file
        ┣ 📂 jmeter/
        ┃ ┣ DevCon-Demo-Script_v2.jmx # JMeter test script using public APIs.
        ┃ ┣ user.properties # Backend Listener config
        ┃ ┗ 📂 results/
        ┃ ┣ results.jtl # Raw test data
        ┃ ┗ html/ # HTML performance report
        ┣ 📂 grafana/
        ┃ ┣ dashboard.json # Optional: Prebuilt Grafana dashboard ( currently not added)
        ┗ README.md # This file
```
---

## 🚀 How It Works

1. ✅ A **GitHub Actions pipeline** triggers when you push to `main`
2. 🧪 It runs **JMeter CLI** tests inside a Docker container
3. 📤 Sends test metrics to **InfluxDB**
4. 📊 Visualize results in **Grafana**
5. 📄 Generates a full **HTML report** and:
   - Uploads it as an artifact
   - (Optional) Publishes to GitHub Pages

---

## ⚙️ Running the Setup Locally

### 1. 🐳 Start InfluxDB + Grafana

      
      docker-compose up -d
      
      InfluxDB: http://localhost:8086
      
      Grafana: http://localhost:3000
      
      ➤ Default login: admin / admin
      

<br />
2. 📥 Import Grafana Dashboard

You can import a pre-configured dashboard from the /grafana/dashboard.json file or build your own panels using the InfluxDB data source (jmeter database).
<br />
<br />
🧪 Test Plan Highlights

The testplan.jmx uses the following best practices:

      ✅ HTTP Request Defaults
      
      ✅ Header Manager
      
      ✅ bzm-Concurrency Thread Group
      
      ✅ Pacing between requests to simulate real user behavior
      
      ✅ Assertions for validation
      
      ✅ JSR223 Groovy scripting to add logic, generate random variables, and write to CSV
      
      ✅ Backend Listener to InfluxDB

<br />
Endpoints tested are available @ jsonplaceholder.typicode.com
<br />
<br />

🧪 Running Tests in CI/CD
🔄 GitHub Actions Workflow

    Stored in: .github/workflows/jmeter-test.yml
    
    The workflow:
    
        Installs JMeter and plugins
        
        Executes test plan
        
        Saves HTML report to jmeter/results/html/
        
        Uploads artifacts for download
<br />
<br />


📝 Sample CLI Command

    jmeter -n -t jmeter/testplan.jmx \
      -l jmeter/results/results.jtl \
      -e -o jmeter/results/html \
      -q jmeter/user.properties \
      -Jjmeter.save.saveservice.output_format=xml \
      -Xms512m -Xmx1024m
<br />
<br />

🧾 HTML Report Publishing

You can automatically publish test results to GitHub Pages using:
<br />
<br />
    
    - name: Deploy report to GitHub Pages
      if: success()
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: jmeter/results/html
    
<br />
<br />

🤝 Contributing
<br />
This is a learning & demo repo, but feel free to fork and adapt to your own projects.
<br />
<br />
👨‍💻 Author

 - Daniel FIFIITA
 - Performance Engineer | CI/CD | Observability | JMeter | LoadRunner | JS
  
 - 📧 daniel.fifiita@gmail.com
  
 - 🔗 [LinkedIn](https://ro.linkedin.com/in/daniel-fifiita "Daniel's LinkedIn")
