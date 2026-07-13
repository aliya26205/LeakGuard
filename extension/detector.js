// ======================================
// LeakGuard Detector Engine (Dynamic)
// ======================================

console.log("🧠 LeakDetector Loaded");

const LeakDetector = {

    async detect(text) {

        const findings = [];

        try {

            const data = await chrome.storage.local.get("policies");

            const policies = data.policies || [];

            for (const policy of policies) {

                if (!policy.is_active) continue;

                try {

                    const regex = new RegExp(policy.pattern, "i");

                    if (regex.test(text)) {

                        findings.push({

                            id: policy.id,

                            type: policy.policy_name,

                            category: policy.category,

                            pattern: policy.pattern,

                            risk: policy.severity,

                            action: policy.action

                        });

                    }

                } catch (err) {

                    console.warn(
                        "Invalid Regex:",
                        policy.policy_name,
                        policy.pattern
                    );

                }

            }

        } catch (err) {

            console.error("Unable to load policies", err);

        }

        return findings;

    }

};