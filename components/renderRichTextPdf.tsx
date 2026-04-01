import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { parseDocument, Element, DataNode, Node } from "htmlparser2";

const styles = StyleSheet.create({
    paragraph: {
        fontSize: 10,
        color: "#52525b",
        lineHeight: 1.45,
        marginTop: 2,
        marginBottom: 2,
    },
    strong: {
        fontWeight: 700,
        color: "#18181b",
    },
    em: {
        fontStyle: "italic",
    },
    h1: {
        fontSize: 14,
        fontWeight: 700,
        color: "#18181b",
        marginTop: 4,
        marginBottom: 4,
    },
    h2: {
        fontSize: 12,
        fontWeight: 700,
        color: "#18181b",
        marginTop: 4,
        marginBottom: 4,
    },
    h3: {
        fontSize: 11,
        fontWeight: 700,
        color: "#18181b",
        marginTop: 3,
        marginBottom: 3,
    },
    list: {
        marginTop: 3,
        marginBottom: 3,
    },
    listItemRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 2,
        paddingRight: 8,
    },
    bullet: {
        width: 14,
        fontSize: 10,
        color: "#52525b",
        lineHeight: 1.45,
    },
    listItemContent: {
        flex: 1,
        fontSize: 10,
        color: "#52525b",
        lineHeight: 1.45,
    },
});

export function renderRichTextPdf(html?: string) {
    if (!html?.trim()) return null;

    const doc = parseDocument(html);
    const bodyNodes = doc.children ?? [];

    return (
        <View>
            {bodyNodes.map((node, index) => (
                <React.Fragment key={index}>{renderNode(node, `${index}`)}</React.Fragment>
            ))}
        </View>
    );
}

function renderChildren(nodes: Node[] = [], path: string) {
    return nodes.map((child, index) => (
        <React.Fragment key={`${path}-${index}`}>
            {renderNode(child, `${path}-${index}`)}
        </React.Fragment>
    ));
}

function renderInlineChildren(nodes: Node[] = [], path: string): React.ReactNode[] {
    return nodes.flatMap((child, index) => {
        const key = `${path}-${index}`;
        const rendered = renderInlineNode(child, key);
        return rendered == null ? [] : [<React.Fragment key={key}>{rendered}</React.Fragment>];
    });
}

function renderNode(node: Node, path: string): React.ReactNode {
    if (node.type === "text") {
        const textNode = node as DataNode;
        const value = normalizeText(textNode.data);
        if (!value) return null;
        return <Text style={styles.paragraph}>{value}</Text>;
    }

    if (node.type !== "tag") return null;

    const el = node as Element;
    const name = el.name.toLowerCase();

    if (name === "p") {
        return <Text style={styles.paragraph}>{renderInlineChildren(el.children, path)}</Text>;
    }

    if (name === "h1") {
        return <Text style={styles.h1}>{renderInlineChildren(el.children, path)}</Text>;
    }

    if (name === "h2") {
        return <Text style={styles.h2}>{renderInlineChildren(el.children, path)}</Text>;
    }

    if (name === "h3") {
        return <Text style={styles.h3}>{renderInlineChildren(el.children, path)}</Text>;
    }

    if (name === "ul") {
        const items = el.children.filter(
            (child) => child.type === "tag" && (child as Element).name === "li"
        ) as Element[];

        return (
            <View style={styles.list}>
                {items.map((item, i) => (
                    <View key={`${path}-ul-${i}`} style={styles.listItemRow}>
                        <Text style={styles.bullet}>• </Text>
                        <View style={{ flex: 1 }}>
                            {renderListItem(item, `${path}-ul-${i}`)}
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    if (name === "ol") {
        const items = el.children.filter(
            (child) => child.type === "tag" && (child as Element).name === "li"
        ) as Element[];

        return (
            <View style={styles.list}>
                {items.map((item, i) => (
                    <View key={`${path}-ol-${i}`} style={styles.listItemRow}>
                        <Text style={styles.bullet}>{`${i + 1}. `}</Text>
                        <View style={{ flex: 1 }}>
                            {renderListItem(item, `${path}-ol-${i}`)}
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    if (name === "div") {
        return <View>{renderChildren(el.children, path)}</View>;
    }

    if (name === "br") {
        return <Text>{"\n"}</Text>;
    }

    if (name === "li") {
        return (
            <View style={styles.listItemRow}>
                <Text style={styles.bullet}>• </Text>
                <View style={{ flex: 1 }}>{renderListItem(el, path)}</View>
            </View>
        );
    }

    return <View>{renderChildren(el.children, path)}</View>;
}

function renderListItem(el: Element, path: string) {
    const blockChildren = el.children.filter(
        (child) => child.type === "tag" && ["ul", "ol", "p", "div"].includes((child as Element).name)
    );

    if (blockChildren.length > 0) {
        return (
            <View>
                {el.children.map((child, index) => (
                    <React.Fragment key={`${path}-li-${index}`}>
                        {child.type === "text" ? (
                            normalizeText((child as DataNode).data) ? (
                                <Text style={styles.listItemContent}>
                                    {normalizeText((child as DataNode).data)}
                                </Text>
                            ) : null
                        ) : (
                            renderNode(child, `${path}-li-${index}`)
                        )}
                    </React.Fragment>
                ))}
            </View>
        );
    }

    return (
        <Text style={styles.listItemContent}>
            {renderInlineChildren(el.children, path)}
        </Text>
    );
}

function renderInlineNode(node: Node, path: string): React.ReactNode {
    if (node.type === "text") {
        const textNode = node as DataNode;
        return normalizeTextKeepSpaces(textNode.data);
    }

    if (node.type !== "tag") return null;

    const el = node as Element;
    const name = el.name.toLowerCase();

    if (name === "strong" || name === "b") {
        return <Text style={styles.strong}>{renderInlineChildren(el.children, path)}</Text>;
    }

    if (name === "em" || name === "i") {
        return <Text style={styles.em}>{renderInlineChildren(el.children, path)}</Text>;
    }

    if (name === "br") {
        return "\n";
    }

    if (name === "p") {
        return <Text>{renderInlineChildren(el.children, path)}{"\n"}</Text>;
    }

    return <Text>{renderInlineChildren(el.children, path)}</Text>;
}

function normalizeText(value: string) {
    return value.replace(/\s+/g, " ").trim();
}

function normalizeTextKeepSpaces(value: string) {
    return value.replace(/\s+/g, " ");
}