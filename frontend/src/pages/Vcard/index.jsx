import QRCode from 'qrcode.react'; 
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';

const QRCodeDisplay = ({ isOpen=false, employee }) => {
  
  if (!isOpen || !employee) {
    return (
      <div className="qr-code-modal">
        <div className="qr-code-content">
          <p>No employee selected or QR Code display is closed.</p>
        </div>
      </div>
    );
  }

  const generateVCF = (employee) => {
    const vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:${employee.first_name} ${employee.last_name}
TEL;TYPE=WORK:${employee.phone_number}
EMAIL:${employee.email}
ORG:${employee.designation_name}
ADR:${employee.address}
END:VCARD`;

    return vcfContent;
  };

  const handleDownloadVCF = () => {
    const vcfContent = generateVCF(employee);
    const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
    saveAs(blob, `${employee.first_name}_${employee.last_name}.vcf`);
  };

  const qrCodeValue = generateVCF(employee);

  return (
    <div className="qr-code-modal">
      <div className="qr-code-content">
        <h2 style={{ textAlign: 'center' }}>QR Code for {employee.first_name} {employee.last_name}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <QRCode value={qrCodeValue} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleDownloadVCF} style={{ width: '150px' }}>Download vCard</button>
        </div>
       
        <p>Scan the QR code to add contact details directly to your phone contacts.</p>
      </div>
    </div>
  );
};

QRCodeDisplay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    designation_name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }),
};

export default QRCodeDisplay;

