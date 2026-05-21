import hudson.plugins.git.GitSCM
import jenkins.model.Jenkins
import org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition
import org.jenkinsci.plugins.workflow.job.WorkflowJob

def instance = Jenkins.get()
def jobName = System.getenv('FINANCE_JOB_NAME') ?: 'finance-api-pipeline'
def repoUrl = System.getenv('FINANCE_REPO_URL') ?: 'https://github.com/MinuzziMatheus/aula.git'
def branch = System.getenv('FINANCE_REPO_BRANCH') ?: 'master'

def job = instance.getItem(jobName)

if (job == null) {
  job = instance.createProject(WorkflowJob, jobName)
}

def scm = new GitSCM(repoUrl)
scm.branches = [new hudson.plugins.git.BranchSpec("*/${branch}")]

job.definition = new CpsScmFlowDefinition(scm, 'Jenkinsfile')
job.save()
instance.save()
