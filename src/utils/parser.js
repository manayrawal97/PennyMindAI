import Papa from 'papaparse';

/**
 * Normalizes and parses raw CSV text into a structured transaction list.
 * @param {string} csvText - The raw CSV content.
 * @returns {Promise<Array>} - Resolves to an array of normalized transactions.
 */
export const parseCSV = (csvText) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: true,
      complete: (results) => {
        try {
          const rawRows = results.data;
          if (rawRows.length === 0) {
            throw new Error('The CSV file is empty.');
          }

          // Inspect the headers of the CSV file
          const headers = Object.keys(rawRows[0]);
          
          // Find mappings
          const dateKey = headers.find(h => /date/i.test(h));
          const descKey = headers.find(h => /desc|narrat|payee|memo|detail/i.test(h));
          const debitKey = headers.find(h => /debit|withdraw|spent|out/i.test(h));
          const creditKey = headers.find(h => /credit|deposit|earned|in/i.test(h));
          const amountKey = headers.find(h => /^amount$|val|total/i.test(h));

          if (!dateKey || !descKey) {
            throw new Error('Unable to find Date and Description columns in the CSV. Please check the file headers.');
          }

          const parsedTransactions = rawRows.map((row, index) => {
            const dateVal = row[dateKey];
            const descVal = row[descKey] || 'Unknown Transaction';
            
            let debit = 0;
            let credit = 0;
            let amount = 0;

            if (debitKey && row[debitKey] !== undefined && row[debitKey] !== null) {
              debit = parseFloat(String(row[debitKey]).replace(/[^\d.-]/g, '')) || 0;
            }
            if (creditKey && row[creditKey] !== undefined && row[creditKey] !== null) {
              credit = parseFloat(String(row[creditKey]).replace(/[^\d.-]/g, '')) || 0;
            }

            if (amountKey && row[amountKey] !== undefined && row[amountKey] !== null) {
              amount = parseFloat(String(row[amountKey]).replace(/[^\d.-]/g, '')) || 0;
              // If we have separate debit/credit but also an amount, verify consistency
              if (!debitKey && !creditKey) {
                if (amount < 0) {
                  debit = Math.abs(amount);
                } else {
                  credit = amount;
                }
              }
            } else {
              // Construct amount from debit/credit
              amount = credit - debit;
            }

            // Absolute debit/credit representation
            debit = Math.abs(debit);
            credit = Math.abs(credit);

            // Clean description
            const cleanedDesc = String(descVal).replace(/\s+/g, ' ').trim();

            return {
              id: `tx-${index}-${Date.now()}`,
              date: dateVal ? formatDate(dateVal) : new Date().toISOString().split('T')[0],
              description: cleanedDesc,
              debit: debit,
              credit: credit,
              amount: amount,
              category: guessCategory(cleanedDesc, amount)
            };
          });

          // Sort chronologically
          parsedTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

          resolve(parsedTransactions);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => {
        reject(new Error(`CSV parsing failed: ${err.message}`));
      }
    });
  });
};

/**
 * Normalizes date formats into YYYY-MM-DD
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    // Try manual splitting for DD/MM/YYYY or DD-MM-YYYY
    const parts = String(dateStr).split(/[-/]/);
    if (parts.length === 3) {
      // Guessing dd-mm-yyyy or yyyy-mm-dd
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      } else if (parts[2].length === 4) {
        // dd/mm/yyyy
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return String(dateStr);
  }
  return d.toISOString().split('T')[0];
}

/**
 * Fallback keyword-based categorizer before Gemini API refines it.
 */
function guessCategory(desc, amount) {
  const text = desc.toLowerCase();
  
  if (amount > 0) return 'Income';
  
  if (/rent|landlord|mortgage|lease/i.test(text)) return 'Housing';
  if (/netflix|spotify|chatgpt|openai|adobe|aws|amazon web services|github|youtube premium|hulu|disney|microsoft/i.test(text)) return 'Subscriptions & SaaS';
  if (/uber|lyft|taxi|train|subway|metro|transit|gas|chevron|shell|mobil|petrol/i.test(text)) return 'Transportation';
  if (/swiggy|zomato|uber eats|starbucks|restaurant|cafe|pub|bar|dining|pizza|burger|mcdonald/i.test(text)) return 'Dining & Drinks';
  if (/whole foods|walmart|grocer|supermarket|target|safeway|kroger|aldi/i.test(text)) return 'Groceries';
  if (/amazon|ebay|shopping|nordstrom|nike|clothing|store|mall|best buy/i.test(text)) return 'Shopping';
  if (/electric|water|gas bill|comcast|at&t|verizon|wifi|internet|utility/i.test(text)) return 'Utilities';
  if (/gym|fitness|workout|membership|health|pharmacy|cvs|walgreens|clinic/i.test(text)) return 'Fitness';
  if (/steam|epic games|nintendo|playstation|xbox|movie|cinema|theater/i.test(text)) return 'Entertainment';
  
  return 'Others';
}
