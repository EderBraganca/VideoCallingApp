import './Footer.css';

export const Footer = () => {
    const alertEmail = (): void => {
        navigator.clipboard.writeText('ederbrape@gmail.com')

        alert('Email copiado com sucesso!');
    }
    return (
        <footer className="footer">
            <section className="footerSection">
                <a href="/about">About</a>
                <a href="/" onClick={alertEmail}>Do you need help? Send me an email</a>
            </section>
        </footer>
    )
}