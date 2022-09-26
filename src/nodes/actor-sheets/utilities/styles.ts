/**
 * A utility function for injecting arbritray global css into the <head>
 * This is used for rendering user created styles for actor sheets and content.
 * @param css String of valid css to be injected into the head.
 * @param uniqueId A unique id for the <style> tag that will be created to hold
 * the inejcted css.
 * @param overwrite Set to true if a style tag should be able to be overwritten
 * with new css when a unqiueId is used more than once. Set to false if attempts
 * to inject css using the same uniqueId should fail.
 * @returns true if styles were applied, false if styles were not applied.
 */
export function injectStyles(css: string, uniqueId: string, overwrite = false) {
    const current = document.getElementById(uniqueId);
    if (!current) {
        const style = document.createElement("style");
        style.textContent = css;
        style.id = uniqueId;
        document.head.append(style);
        return true;
    } else if (overwrite) {
        current.textContent = css;
        return true;
    }
    return false;
}
