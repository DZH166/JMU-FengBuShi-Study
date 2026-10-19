"""Sync to the explicitly requested GitHub repository using the Git credential helper.
Credentials remain in process memory and are never printed or persisted by this script.
"""
import os, subprocess, json, urllib.request, urllib.error
env={**os.environ,'GIT_TERMINAL_PROMPT':'0','GCM_INTERACTIVE':'Never'}
r=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',text=True,capture_output=True,env=env)
if r.returncode:
    print('GitHub credential unavailable to Git CLI. Browser-created repository can still be used.');raise SystemExit(2)
fields=dict(line.split('=',1) for line in r.stdout.splitlines() if '=' in line)
token=fields.get('password')
if not token:print('GitHub credential unavailable.');raise SystemExit(2)
req=urllib.request.Request('https://api.github.com/user',headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','User-Agent':'JMU-Study-Repository-Setup'})
try:
    with urllib.request.urlopen(req,timeout=25) as resp:user=json.load(resp)
except urllib.error.HTTPError as e:print('GitHub authentication check failed:',e.code);raise SystemExit(2)
print(json.dumps({'github_user':user['login'],'git_ready':True}))
repo_name='JMU-FengBuShi-Study'
repo_url=f'https://api.github.com/repos/{user["login"]}/{repo_name}'
def api(url,body=None):
    request=urllib.request.Request(url,data=json.dumps(body).encode() if body is not None else None,headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','User-Agent':'JMU-Study-Repository-Setup','Content-Type':'application/json'})
    with urllib.request.urlopen(request,timeout=25) as response:return json.load(response)
try: repo=api(repo_url)
except urllib.error.HTTPError as e:
    if e.code!=404:raise
    repo=api('https://api.github.com/user/repos',{'name':repo_name,'description':'分布式系统交互学习手册：完整课程地图、问题驱动讲解、机制实验与理解检验。','private':True,'auto_init':False})
print(json.dumps({'repository':repo['html_url'],'private':repo['private'],'default_branch':repo['default_branch']},ensure_ascii=True))
