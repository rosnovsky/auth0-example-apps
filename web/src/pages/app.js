import {
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle,
    Row,
    Button,
    Container,
    Col
} from "reactstrap"
import React, { useState, useEffect} from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import { ProfilePlaceholder } from "../pages/profile"

const AppPage = ({ data }) => {
    const [siteScreenshot, setSiteScreenshot] = useState();

    useEffect(() => {
        // This is a temporary proof-of concept.
    
        // On deploy, netlify should run a webhook, touching the below endpoint. This would trigger a serverless function, which in turn would fetch the latest screenshot of all deployed sites and put them into corresponding Sanity objects. Somewhere inbetween it could be worth it to resize/compress sccreenshots with kraken.io.
    
        // For now, this code just fetches a single screenshot which acts as a placeholder.
        const screenshot = async () => {
          return fetch("https://dse.netlify.app/.netlify/functions/screenshot", { headers: { "Accept": "application/json" } })
              .then(response => response.json())
              .then(data => {
                  setSiteScreenshot(data);
                  })
          .catch(error => ({ statusCode: 422, body: String(error) }));
      };
      screenshot();
      }, [])

    const app = data.sanityApp
    return (
        <Layout>
            <SEO title={app.title} />
            <Container fluid="true" className="container-fluid px-auto mx-auto">
                <Row className="pb-5">
                    <Col className="d-flex mx-auto justify-content-center">
                        <Card style={{ width: 24 + "rem" }} className="mx-auto mt-5">
                            {siteScreenshot ?
                                <CardImg
                                top
                                style={{ minHeight: "200px" }}
                                src={siteScreenshot}
                                alt={app.node.title}
                                loading="lazy"
                                />
                            : <ProfilePlaceholder type="screenshot" /> }
                            <CardBody>
                                <CardTitle>
                                    <h2>{app.title}</h2>
                                </CardTitle>
                                <CardText>{app._rawDescription[0].children[0].text}</CardText>
                                <Row className="mx-auto justify-content-between">
                                    <p>
                                    <a href={app.quickstart} className="text-muted">
                                        Quickstart
                                    </a>
                                    </p>
                                    <p>
                                    <a href={app.docs} className="text-muted">
                                        Docs
                                    </a>
                                    </p>
                                </Row>
                                <Row className="mx-auto justify-content-between">
                                    <p className="text-muted">
                                        Tech Stack: <img src={app.technology.logo.asset.url} width="20px" alt={app.technology.title} />
                                    </p>
                                </Row>
                                <Row className="mx-auto justify-content-center mb-3">
                                    <a href={app.deploy} className="deploy">
                                    <img src="https://zeit.co/button" alt="Deploy to ZEIT Now" />
                                    </a>
                                </Row>
                                <Row className="mx-auto justify-content-center mb-3">
                                    <Button className="btn-block btn-light" href={app.url}>
                                    {app.title} &rarr;
                                    </Button>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    )
}

export default AppPage

export const data = graphql`
query AppPageQuery($id: String){
    sanityApp(_id: {eq: $id}) {
        title
        screenshot {
            asset {
                url
            }
        }
        _rawDescription(resolveReferences: {maxDepth: 5})
        technology {
            title
            slug {
                current
            }
            logo {
                asset {
                    url
                }
            }
        }
        slug {
            current
        }
        deploy
        quickstart
        docs
        url
        _id
    }
}`
