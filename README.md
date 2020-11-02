# Générateur de certificat de déplacement en "1-click"

Try me online:
[https://covid19.coulombel.site/?address=15 rue d'Antibes&birthday=20/03/1882&city=Antibes&firstname=Rene&minutesoffset=5&lastname=Coty&placeofbirth=Le Havre&zipcode=06600&reason=sport_animaux](https://covid19.coulombel.site/?address=15%20rue%20d%27Antibes&birthday=20/03/1882&city=Antibes&firstname=Rene&minutesoffset=5&lastname=Coty&placeofbirth=Le%20Havre&zipcode=06600&reason=sport_animaux)

## Purpose

Ce projet permet de générer une attestation de déplacement en "1-click" pour le confinement saison 2 lance en France le vendredi 30 Octobre 2020.
En effet la version numérique du gouvernement (https://media.interieur.gouv.fr/deplacement-covid-19/) nécessite
- Plus d'un click pour générer une attestation
- Force a re-renter les informations a chaque utilisation sur certains navigateurs (see [autocomplete](https://gist.github.com/niksumeiko/360164708c3b326bd1c8) set to [false](https://github.com/LAB-MI/attestation-deplacement-derogatoire-q4-2020/blob/a2566e82555c56442dbdc6857c21f0e4c8c5dc39/src/js/form.js#L22)),
<!-- Presente des anomalies sur dispositif mobile pour télécharger #attestations > 1 par jour (achats + sports) sur dispositif mobile -->
Ce projet a été élabore en partant de la base de code de la version numérique du gouvernement dont la version est disponible sur Github ici:
https://github.com/LAB-MI/attestation-deplacement-derogatoire-q4-2020

Ce projet est deployé a cet URL sur Google Cloud Platform (cloud run):
[https://covid19.coulombel.site/](https://covid19.coulombel.site/)

## Usage

Il a ete concu pour bookmarker une URL sur dispositif mobile pour downloader une nouvelle attestation par example:

Par example: [https://covid19.coulombel.site/?address=15 rue d'Antibes&birthday=20/03/1882&city=Antibes&firstname=Rene&minutesoffset=5&lastname=Coty&placeofbirth=Le Havre&zipcode=06600&reason=sport_animaux](https://covid19.coulombel.site/?address=15%20rue%20d%27Antibes&birthday=20/03/1882&city=Antibes&firstname=Rene&minutesoffset=5&lastname=Coty&placeofbirth=Le%20Havre&zipcode=06600&reason=sport_animaux)

generera une attestation avec pour

- address=15 rue d'Antibes: Addresse de votre habitation
- birthday=20/03/1882: Date de votre aniversaire
- city=Antibes: Ville d'habitation 
- firstname=Rene: Votre prenom 
- minutesoffset=60: Date de sortie genere a partir de l'heure actuelle en ajoutant un offset (qui peut etre negatif)
- lastname=Coty: votre nom
- placeofbirth=Le Havre: votre lieu de naissaince
- zipcode=06600: votre code postale
- reason=sport_animaux: la raison de votre sortie
Les raisons valides sont: travail, achats, sante, famille, handicap, sport animaux, convocation, missions, enfants

Appreciez votre sortie, sortez couvert et respectez les gestes barrières !

En général deux bookmarks suffisent car seule la raison change.

Je recommende d'utiliser sur Android Firefox qui permet de changer facilement l'URL et d'exporter un lien en application.
<!-- chrome a aussi le widget favoris -->   

## Développer

### Installer le projet

```console
git clone https://github.com/scoulomb/attestation-covid19-saison2-auto
cd attestation-covid19-saison2-auto
npm i
npm start
```

## Générer et tester le code de production

### Tester le code de production en local

#### Générer le code de production pour tester que le build fonctionne en entier

```console
npm run build:dev
```

#### Tester le code de production en local

```console
npx serve dist
```

Et visiter http://localhost:5000

Le code à déployer sera le contenu du dossier `dist`

## Hosting and project deployment 

<!--
### Try github page

It work but not the rendering ;(
https://medium.com/mobile-web-dev/how-to-build-and-deploy-a-react-app-to-github-pages-in-less-than-5-minutes-d6c4ffd30f14

when configure discrepancy with article

`"predeploy": "npm run build:dev"` instead of  `"predeploy": "npm run build:dev"`  (otherwise run a pylint equivalent)

and ensure remote origin is pointing to for otherwise 403 error well configured
Then may need to [clean cache](https://stackoverflow.com/questions/63964575/fatal-a-branch-named-gh-pages-already-exists)

$ git remote remove origin
$ git remote add origin  https://github.com/scoulomb/attestation-deplacement-derogatoire-q4-2020.git 
$ sudo rm -rf node_modules/.cache/gh-pages
$ npm run deploy

As our DNS is coulombel.it (we need to start docker DNS if needed)

-->

## Releasing 

I propose to release the application as a Docker image:

<!-- Idea of image here: https://github.com/LAB-MI/attestation-deplacement-derogatoire-q4-2020/pull/64/commits/c72c1155ecc46ceef480db8d3f6b476019cb24a6 -->

To build and run do

```shell script
sudo docker build . -t covid
sudo docker run -p 5000:5000 covid
```
 
It is delivered here on Dockerhub: https://hub.docker.com/repository/docker/scoulomb/cov19

#### Manual release

````shell script
sudo docker build . -t  scoulomb/cov19
sudo docker login
# Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
# Username: scoulomb
# Password: 
sudo docker push scoulomb/cov19:beta
````

or we can configure Dockerhub to build a new image at every push, this is what we have done.
When configuring dockerhub pay attention to build main branch and not master (default name has changed in october 2020).

<!--
In Dockerhub we had this error (same with gcr) unlike local build and reason why we did

````shell script
[91mcross-env: not found
(t we need RUN npm install cross-env as gcp wheeas worked locally)
````
-->

## Deploy to production

### Deploy with home server  

For more details please read this [article](https://github.com/scoulomb/myDNS/blob/master/2-advanced-bind/5-real-own-dns-application/6-use-linux-nameserver-part-a.md#configure-a-dynamic-dns).

#### Deploy 

- Deploy the application directly on your server with `npm` command or via `Docker`, `Compose` or `Kube`.
- Configure reverse NAT to map inbound port to port 5000 

#### DNS

Configure DNS to point to dynamic DNS (CNAME) 
<!-- I tried gandi live DNS, own DNS. In mydns project did not try to have another app in kube, could have deployed the DNS with docker --> 
we can als use Gandi redirection whcih work with port mapping.


### Deploy in the Cloud 

#### Deploy application in Google Cloud run 

I choose to deploy in Google Cloud Run, see: 
- https://cloud.google.com/free
- https://cloud.google.com/run/docs/quickstarts/build-and-deploy

Here is how

````shell script
sudo snap install google-cloud-sdk --classic
gcloud projects create scoulomb-covid19-saison2
# Create the project: https://console.cloud.google.com/billing/linkedaccount?project=scoulomb-covid19-saison2, attach billing info to it
gcloud config set project scoulomb-covid19-saison2
````

<!--
Note `ERROR`:

```shell script
gcloud run deploy --image busybox --platform managed
ERROR: (gcloud.run.deploy) Expected a Container Registry image path like [region.]gcr.io/repo-path[:tag or @digest] or an Artifact Registry image path like [region-]docker.pkg.dev/repo-path[:tag or @digest], but obtained registry.hub.docker.com/library/busybox
```

Unfortunatelty we can not use image in Dockerhub, we have to use gcr
https://stackoverflow.com/questions/50881454/is-there-a-way-to-directly-deploy-a-container-from-docker-hub-to-google-compute

-->

Unfortunately we can not use image in Dockerhub, we have to use gcr

For this do
```shell script
gcloud builds submit --tag gcr.io/scoulomb-covid19-saison2/cov19
```

<!-- (note we need RUN npm install cross-env in Dockerfile as for dockerhub) -->

And finally deploy

````shell script
gcloud run deploy --image gcr.io/scoulomb-covid19-saison2/cov19 --platform managed
````

It will give you a service link on which we can access the APP

```shell script
https://cov19-uhdzrcl53a-ew.a.run.app
```

Note that `-p 80:5000` was done, which is strangely working without any additional conf cf.
https://cloud.google.com/run/docs/reference/container-contract

 
####  Configure DNS 

##### Define a CNAME?

````shell script
$ nslookup -type=A cov19-uhdzrcl53a-ew.a.run.app
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
Name:	cov19-uhdzrcl53a-ew.a.run.app
Address: 216.239.36.53
````

`covi.coulombel.site IN CNAME cov19-uhdzrcl53a-ew.a.run.app`
 
 This will not work.
 Because behind there is routing based on host HEADER (like OpenShift route or k8s Ingress, unlike a Service NodePort/lb)

For instance if we change the Host header we have acess to the application.
 
 ```shell script
 $ curl -L  --header "Host: cov19-uhdzrcl53a-ew.a.run.app" http://covi.coulombel.site -v
```
<!-- curl does not generate certif has js but something different -->

##### Mapping custom domain in cloud run 

Actually we have to define a mapping between service and domain
 <!-- equivalent in OpenShift route when change the route name to match the DNS -->
 
 This is explained here:
 https://cloud.google.com/run/docs/mapping-custom-domains?hl=fr
 It is performed in 3 steps
 
- select service   
- select and validate domain-> it should be coulombel.site, no subdomain. it is performing this validation by Calling registrar manager (Gandi for instance) API to insert TXT record.
TXT record enable google to validate we are owner of the domain.
Or we can do it manually,
- select subdomain just "covid19"
 
Then it says to update CNAME 
````shell script
 covid19 300 IN CNAME ghs.googlehosted.com.
````

**Very important validation can be stuck I we forgot `.` at the end of record definition**

We should not do `covid19 300 IN CNAME ghs.googlehosted.com`

<!-- while google dit not validate it is insecure -->

This is great as it enables a CNAME redirection while it keeps the https secure.
 
<!-- open with firefox to have rights -->



If we map an apex domain and not a subdomain we have to map A and AAAA not a CNAME.

````shell script
@ 300 IN A 216.239.32.21
@ 300 IN A 216.239.34.21
@ 300 IN A 216.239.36.21
@ 300 IN A 216.239.38.21
@ 300 IN AAAA 2001:4860:4802:32::15
@ 300 IN AAAA 2001:4860:4802:34::15
@ 300 IN AAAA 2001:4860:4802:36::15
@ 300 IN AAAA 2001:4860:4802:38::15
````

We had seen same issue here: https://github.com/scoulomb/github-page-helm-deployer/blob/master/appendix-github-page-and-dns.md#go
It is because we can not have a CNAME as APEX level (zone level).

```
@ IN CNAME example.com 
```

In Gandi API (with dev console) we can see

```
description: "can't use '@' for CNAME records (param: {'rrset_type': u'CNAME', 'rrset_ttl': 1800, 'rrset_name': u'@', 'rrset_values': [u'yop.tets.it']})" }
```

This is needed for AdSense validation. Otherwise it is not needed.

<!--remove gandi redirection, and record note it was also a A here -->
<!-- mapping ok but record not working, on chrome/firefox need to clean browser cache: Cookies and Site Data, for negative TTL change in etc resolve dns, wait -->
<!-- During my test I saw Gandi prevents from having a TXT and CNAME with same name, et autre dans 6 use linux nameserver --> 

#### Update and Continuous Delivery/Deployment

We will actually now setup continuous deployment from git on cloud run
https://cloud.google.com/run/docs/continuous-deployment-with-cloud-build

<!--cross env in docker file needed -->

## Crédits

Ce projet a été réalisé à partir d'un fork du dépôt [attestation deplacement derogatoire q4 2020](https://github.com/LAB-MI/attestation-deplacement-derogatoire-q4-2020)
de lui meme realise à partir d'un fork du dépôt  [deplacement-covid-19](https://github.com/nesk/deplacement-covid-19) de lui-même réalisé à partir d'un fork du dépôt [covid-19-certificate](https://github.com/nesk/covid-19-certificate) de [Johann Pardanaud](https://github.com/nesk).

Les projets open source suivants ont été utilisés pour le développement de ce
service :

- [PDF-LIB](https://pdf-lib.js.org/)
- [qrcode](https://github.com/soldair/node-qrcode)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/license)


<!-- remove idea file https://stackoverflow.com/questions/10067848/remove-folder-and-its-contents-from-git-githubs-history -->

