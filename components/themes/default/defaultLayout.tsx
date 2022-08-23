import styles from './css/layout.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import DefaultHeader from "./defaultHeader";
import DefaultFooter from "./defaultFooter";
import {Alert, Container, Row} from "react-bootstrap";
import SiteConfig from "../../../lib/common/siteconfig";

/**
 * 默认布局
 * @param props
 * @param children
 * @constructor
 */
export default function DefaultLayout({
                                          props,
                                          keyword,
                                          children,
                                          type
                                      }: { props: SiteConfig, keyword?: string, children: any, type: string }) {
    return (
        <>
            <Container>
                <Row>
                    <DefaultHeader props={props} keyword={keyword} type={type}/>
                </Row>
                <Row>
                    <Container>
                        {keyword &&
                            <Alert className={styles.sKeywordInfo} key="info" variant="info">
                                关键词： {keyword}
                            </Alert>
                        }
                    </Container>
                </Row>
                <Row>
                    <main className={styles.main}>{children}</main>
                </Row>
                <Row>
                    <DefaultFooter props={props}/>
                </Row>
            </Container>
        </>
    )
}
